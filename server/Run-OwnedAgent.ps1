[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$AgentPath,[Parameter(Mandatory=$true)][string]$AuthPath,[Parameter(Mandatory=$true)][string]$EndpointPath,[Parameter(Mandatory=$true)][int]$GuardianId,[int]$DurationMs=1800000)
$ErrorActionPreference='Stop'
try {
  Add-Type -Path (Join-Path $PSScriptRoot 'lib/OwnedJob.cs')
  $result=[MushiOwnedJob]::Run($AgentPath,@('start','mushijingi-beta-trial',('--config='+$AuthPath+','+$EndpointPath),'--log=false'),$GuardianId,$DurationMs)
  exit $result
} catch { exit 1 }
