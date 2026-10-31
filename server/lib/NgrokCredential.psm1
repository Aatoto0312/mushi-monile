Set-StrictMode -Version Latest

function Save-NgrokCredential {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)][string]$Directory,
        [Parameter(Mandatory=$true)][Security.SecureString]$Token,
        [Parameter(Mandatory=$true)][string]$EndpointYaml
    )
    $ErrorActionPreference = 'Stop'
    $buffer = [IntPtr]::Zero
    $plain = $null
    $auth = $null
    try {
        if (-not [IO.Path]::IsPathRooted($Directory) -or (Test-Path -LiteralPath $Directory)) { throw 'Directory must be new and absolute' }
        # Only the new leaf receives an ACL; no inherited parent/service ACL is changed.
        $cursor = [IO.DirectoryInfo]([IO.Path]::GetDirectoryName($Directory))
        while ($null -ne $cursor) {
            if ($cursor.Exists -and (($cursor.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)) { throw 'Reparse ancestor' }
            $cursor = $cursor.Parent
        }
        $buffer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token)
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($buffer)
        if ([string]::IsNullOrWhiteSpace($plain) -or $plain.Length -gt 512 -or $plain -match '[\s\x00]') { throw 'Token invalid' }
        [IO.Directory]::CreateDirectory($Directory) | Out-Null
        $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $acl = New-Object Security.AccessControl.DirectorySecurity
        $acl.SetOwner($identity.User)
        $acl.SetAccessRuleProtection($true, $false)
        $principals = @($identity.User, (New-Object Security.Principal.SecurityIdentifier('S-1-5-18')), (New-Object Security.Principal.SecurityIdentifier('S-1-5-32-544')))
        foreach ($principal in $principals) {
            $rule = New-Object Security.AccessControl.FileSystemAccessRule($principal, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
            $acl.AddAccessRule($rule)
        }
        Set-Acl -LiteralPath $Directory -AclObject $acl
        # A YAML single-quoted scalar escapes quotes by doubling them. Keep plaintext
        # away from cmdlet parameters that PowerShell module logging might record.
        $quoted = "'" + $plain.Replace("'", "''") + "'"
        $auth = "version: 3`nagent:`n  authtoken: $quoted`n  web_addr: false`n"
        $encoding = New-Object Text.UTF8Encoding($false)
        [IO.File]::WriteAllText((Join-Path $Directory 'endpoint.yml'), $EndpointYaml, $encoding)
        [IO.File]::WriteAllText((Join-Path $Directory 'auth.yml'), $auth, $encoding)
        [pscustomobject]@{ status='saved'; directory=$Directory }
    }
    catch { throw 'NGROK_CREDENTIAL_SAVE_FAILED: no existing directory is overwritten; token was not printed.' }
    finally {
        $plain = $null; $auth = $null; $quoted = $null
        if ($buffer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($buffer) }
    }
}
Export-ModuleMember -Function Save-NgrokCredential
