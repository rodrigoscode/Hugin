package cliui

import "strings"

type Command string

const (
	CommandInstall   Command = "install"
	CommandUninstall Command = "uninstall"
	CommandStatus    Command = "status"
	CommandHelp      Command = "help"
)

var commandAliases = map[string]Command{
	"install":   CommandInstall,
	"uninstall": CommandUninstall,
	"remove":    CommandUninstall,
	"status":    CommandStatus,
	"help":      CommandHelp,
}

// Options is the parsed command line: a command plus --flag / --key=value
// arguments.
type Options struct {
	Command Command
	Flags   map[string]bool
	Values  map[string]string
}

func (o Options) Has(flag string) bool { return o.Flags[flag] }
func (o Options) Get(key string) (string, bool) {
	v, ok := o.Values[key]
	return v, ok
}

// ParseArguments reads the command line: any argument not starting with "--"
// selects the command; "--flag" sets a boolean; "--key=value" sets a value. An
// unknown command, or --help, forces the help screen.
func ParseArguments(argv []string) Options {
	opts := Options{
		Command: CommandInstall,
		Flags:   map[string]bool{},
		Values:  map[string]string{},
	}

	unknownCommand := false

	for _, arg := range argv {
		if !strings.HasPrefix(arg, "--") {
			if resolved, ok := commandAliases[arg]; ok {
				opts.Command = resolved
			} else {
				unknownCommand = true
			}
			continue
		}

		rest := arg[2:]
		if key, value, found := strings.Cut(rest, "="); found {
			if key != "" {
				opts.Values[key] = value
			}
		} else if rest != "" {
			opts.Flags[rest] = true
		}
	}

	if opts.Flags["help"] || opts.Flags["h"] || unknownCommand {
		opts.Command = CommandHelp
	}

	return opts
}
