//go:build windows

// Package audiocap captures what Windows plays through the process loopback
// API (Windows 10 build 20348 and later), which can leave one process tree out
// of the capture.
package audiocap

import (
	"bufio"
	"fmt"
	"io"
	"runtime"
	"syscall"
	"time"
	"unsafe"
)

// SampleRate and Channels describe the PCM CaptureExcluding writes: 16-bit
// little-endian samples, interleaved.
const (
	SampleRate = 48000
	Channels   = 2
)

var (
	coInitializeEx              = syscall.NewLazyDLL("ole32.dll").NewProc("CoInitializeEx")
	activateAudioInterfaceAsync = syscall.NewLazyDLL("mmdevapi.dll").NewProc("ActivateAudioInterfaceAsync")
	kernel32                    = syscall.NewLazyDLL("kernel32.dll")
	createEvent                 = kernel32.NewProc("CreateEventW")
	waitForSingleObject         = kernel32.NewProc("WaitForSingleObject")
)

type guid struct {
	data1 uint32
	data2 uint16
	data3 uint16
	data4 [8]byte
}

var (
	iidUnknown            = guid{0x00000000, 0x0000, 0x0000, [8]byte{0xC0, 0, 0, 0, 0, 0, 0, 0x46}}
	iidAgileObject        = guid{0x94EA2B94, 0xE9CC, 0x49E0, [8]byte{0xC0, 0xFF, 0xEE, 0x64, 0xCA, 0x8F, 0x5B, 0x90}}
	iidActivateCompletion = guid{0x41D949AB, 0x9862, 0x444A, [8]byte{0x80, 0xF6, 0xC2, 0x61, 0x33, 0x4D, 0xA5, 0xEB}}
	iidAudioClient        = guid{0x1CB9AD4C, 0xDBFA, 0x4C32, [8]byte{0xB1, 0x78, 0xC2, 0xF5, 0x68, 0xA7, 0x03, 0xB2}}
	iidAudioCaptureClient = guid{0xC8ADBD64, 0xE71E, 0x48A0, [8]byte{0xA4, 0xDE, 0x18, 0x5C, 0x39, 0x5C, 0xD3, 0x17}}
)

const (
	activationTypeProcessLoopback = 1
	loopbackExcludeTargetTree     = 1
	streamFlagsLoopback           = 0x00020000
	streamFlagsEventCallback      = 0x00040000
	streamFlagsSRCDefaultQuality  = 0x08000000
	streamFlagsAutoConvertPCM     = 0x80000000
	bufferFlagsSilent             = 0x2
	vtBlob                        = 65
	bufferDuration                = 1_000_000
)

// IAudioClient and IAudioCaptureClient method indexes.
const (
	methodRelease         = 2
	clientInitialize      = 3
	clientStart           = 10
	clientStop            = 11
	clientSetEventHandle  = 13
	clientGetService      = 14
	captureGetBuffer      = 3
	captureReleaseBuffer  = 4
	captureNextPacketSize = 5
	operationGetResult    = 3
)

// comObject is a COM interface pointer: its first word points at the method table.
type comObject struct {
	vtbl *[16]uintptr
}

func (o *comObject) call(method int, args ...uintptr) int32 {
	all := make([]uintptr, 0, len(args)+1)
	all = append(all, uintptr(unsafe.Pointer(o)))
	all = append(all, args...)
	r, _, _ := syscall.SyscallN(o.vtbl[method], all...)
	return int32(r)
}

func (o *comObject) release() {
	o.call(methodRelease)
}

type activation struct {
	hr     int32
	client *comObject
}

// completionHandler implements IActivateAudioInterfaceCompletionHandler (and
// IAgileObject, which the activation requires) in Go memory.
type completionHandler struct {
	vtbl   *[4]uintptr
	result chan activation
}

var completionVtbl = [4]uintptr{
	syscall.NewCallback(func(this *completionHandler, riid *guid, out **completionHandler) uintptr {
		if *riid == iidUnknown || *riid == iidActivateCompletion || *riid == iidAgileObject {
			*out = this
			return 0
		}
		*out = nil
		return 0x80004002
	}),
	syscall.NewCallback(func(this *completionHandler) uintptr { return 1 }),
	syscall.NewCallback(func(this *completionHandler) uintptr { return 1 }),
	syscall.NewCallback(func(this *completionHandler, operation *comObject) uintptr {
		var hr int32
		var activated *comObject
		operation.call(operationGetResult, uintptr(unsafe.Pointer(&hr)), uintptr(unsafe.Pointer(&activated)))
		this.result <- activation{hr: hr, client: activated}
		return 0
	}),
}

type processLoopbackParams struct {
	activationType uint32
	targetProcess  uint32
	mode           uint32
}

type blobVariant struct {
	vt       uint16
	reserved [6]byte
	size     uint32
	_        uint32
	data     *processLoopbackParams
}

type waveFormat struct {
	formatTag      uint16
	channels       uint16
	samplesPerSec  uint32
	avgBytesPerSec uint32
	blockAlign     uint16
	bitsPerSample  uint16
	extraSize      uint16
}

func hresultError(call string, hr int32) error {
	return fmt.Errorf("%s: HRESULT 0x%08X", call, uint32(hr))
}

// activateExcluding activates an IAudioClient on the process loopback device
// that leaves the process tree of pid out.
func activateExcluding(pid uint32) (*comObject, error) {
	params := processLoopbackParams{
		activationType: activationTypeProcessLoopback,
		targetProcess:  pid,
		mode:           loopbackExcludeTargetTree,
	}
	variant := blobVariant{vt: vtBlob, size: uint32(unsafe.Sizeof(params)), data: &params}
	handler := &completionHandler{vtbl: &completionVtbl, result: make(chan activation, 1)}
	path, err := syscall.UTF16PtrFromString(`VAD\Process_Loopback`)
	if err != nil {
		return nil, err
	}

	var operation *comObject
	r, _, _ := activateAudioInterfaceAsync.Call(
		uintptr(unsafe.Pointer(path)),
		uintptr(unsafe.Pointer(&iidAudioClient)),
		uintptr(unsafe.Pointer(&variant)),
		uintptr(unsafe.Pointer(handler)),
		uintptr(unsafe.Pointer(&operation)),
	)
	if hr := int32(r); hr < 0 {
		return nil, hresultError("ActivateAudioInterfaceAsync", hr)
	}
	defer operation.release()

	select {
	case result := <-handler.result:
		runtime.KeepAlive(handler)
		runtime.KeepAlive(&variant)
		if result.hr < 0 || result.client == nil {
			return nil, hresultError("process loopback activation", result.hr)
		}
		return result.client, nil
	case <-time.After(5 * time.Second):
		return nil, fmt.Errorf("process loopback activation timed out")
	}
}

// CaptureExcluding writes everything Windows plays, except what the process
// tree of pid plays, to out until writing fails.
func CaptureExcluding(pid uint32, out io.Writer) error {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	coInitializeEx.Call(0, 0)

	client, err := activateExcluding(pid)
	if err != nil {
		return err
	}
	defer client.release()

	format := waveFormat{
		formatTag:      1,
		channels:       Channels,
		samplesPerSec:  SampleRate,
		avgBytesPerSec: SampleRate * Channels * 2,
		blockAlign:     Channels * 2,
		bitsPerSample:  16,
	}
	flags := uintptr(streamFlagsLoopback | streamFlagsEventCallback | streamFlagsSRCDefaultQuality | streamFlagsAutoConvertPCM)
	if hr := client.call(clientInitialize, 0, flags, bufferDuration, 0, uintptr(unsafe.Pointer(&format)), 0); hr < 0 {
		return hresultError("IAudioClient.Initialize", hr)
	}

	event, _, _ := createEvent.Call(0, 0, 0, 0)
	if event == 0 {
		return fmt.Errorf("CreateEvent failed")
	}
	defer syscall.CloseHandle(syscall.Handle(event))
	if hr := client.call(clientSetEventHandle, event); hr < 0 {
		return hresultError("IAudioClient.SetEventHandle", hr)
	}

	var capture *comObject
	if hr := client.call(clientGetService, uintptr(unsafe.Pointer(&iidAudioCaptureClient)), uintptr(unsafe.Pointer(&capture))); hr < 0 {
		return hresultError("IAudioClient.GetService", hr)
	}
	defer capture.release()

	if hr := client.call(clientStart); hr < 0 {
		return hresultError("IAudioClient.Start", hr)
	}
	defer client.call(clientStop)

	writer := bufio.NewWriterSize(out, 16*1024)
	var silence []byte

	for {
		waitForSingleObject.Call(event, 200)

		for {
			var packet uint32
			if hr := capture.call(captureNextPacketSize, uintptr(unsafe.Pointer(&packet))); hr < 0 {
				return hresultError("IAudioCaptureClient.GetNextPacketSize", hr)
			}
			if packet == 0 {
				break
			}

			var data *byte
			var frames, bufferFlags uint32
			var devicePosition, qpcPosition uint64
			if hr := capture.call(captureGetBuffer,
				uintptr(unsafe.Pointer(&data)),
				uintptr(unsafe.Pointer(&frames)),
				uintptr(unsafe.Pointer(&bufferFlags)),
				uintptr(unsafe.Pointer(&devicePosition)),
				uintptr(unsafe.Pointer(&qpcPosition)),
			); hr < 0 {
				return hresultError("IAudioCaptureClient.GetBuffer", hr)
			}

			size := int(frames) * Channels * 2
			var writeErr error
			if bufferFlags&bufferFlagsSilent != 0 || data == nil {
				if len(silence) < size {
					silence = make([]byte, size)
				}
				_, writeErr = writer.Write(silence[:size])
			} else {
				_, writeErr = writer.Write(unsafe.Slice(data, size))
			}
			capture.call(captureReleaseBuffer, uintptr(frames))
			if writeErr != nil {
				return writeErr
			}
		}

		if err := writer.Flush(); err != nil {
			return err
		}
	}
}
