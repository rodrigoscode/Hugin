<#
    Builds dist\Hugin.exe: bundles the JavaScript payload, checks it and compiles.
    The icon and version info come from resource_windows_amd64.syso (see tools/gen-icon).
#>

[CmdletBinding()]
param(
    [string]$Output = "dist\Hugin.exe"
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Step($text) { Write-Host "`n  == $text" -ForegroundColor Cyan }

New-Item -ItemType Directory -Force -Path "dist" | Out-Null

Step "Bundling the payload"
go run ./tools/bundle
if ($LASTEXITCODE -ne 0) { throw "bundle failed" }

$payload = @("dist/payload/main.js", "dist/payload/renderer.js", "src/preload/preload.js", "src/preload/view-preload.js")

Step "Checking the payload parses"
foreach ($file in $payload) {
    node --check $file
    if ($LASTEXITCODE -ne 0) { throw "$file does not parse" }
}

Step "Checking the payload for orphaned references"
go run ./tools/check-refs @payload
if ($LASTEXITCODE -ne 0) { throw "check-refs found a suspicious reference" }

Step "Compiling"
go build -ldflags="-H=windowsgui -s -w" -o $Output .
if ($LASTEXITCODE -ne 0) { throw "go build failed" }

Step "Done"
$info = Get-Item $Output
Write-Host ("     {0}  ({1:N1} MB)" -f $info.FullName, ($info.Length / 1MB)) -ForegroundColor Green
