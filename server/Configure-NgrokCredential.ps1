[CmdletBinding()]
param([switch]$SaveToken)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
# Store packaged ngrok cannot see our nonstandard AppData directory.
# Keep credentials outside AppData; the new leaf still receives restricted ACLs.
$directory = Join-Path $env:USERPROFILE '.mushijingi-online-beta/ngrok'

if (-not $SaveToken) {
    Write-Output 'Preparation only. No token requested, files saved, agent started or Windows task registered.'
    Write-Output ('Credential directory: ' + $directory)
    Write-Output 'Run with -SaveToken in your own local terminal to enter the token without displaying it.'
    return
}
if (Test-Path -LiteralPath $directory) { throw 'Dedicated directory already exists. It was not read or overwritten; ask for a scoped review.' }
$node = (Get-Command node -ErrorAction Stop).Source
$endpoint = & $node (Join-Path $PSScriptRoot 'lib/ngrok-preparation.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Public endpoint plan is invalid. No token was requested.' }
Import-Module (Join-Path $PSScriptRoot 'lib/NgrokCredential.psm1') -Force
$token = Read-Host 'Paste your ngrok authtoken here (hidden; do not paste into chat)' -AsSecureString
try {
    Save-NgrokCredential -Directory $directory -Token $token -EndpointYaml ($endpoint -join "`n") | Out-Null
    Write-Output 'Saved locally with restricted Windows permissions. No tunnel was started. Token validity is not yet verified.'
}
finally { if ($null -ne $token) { $token.Dispose() } }
