# SSH connection script for jino.ru
$password = "42hornAras!"
$username = "j8808879"
$hostname = "j8808879.myjino.ru"

# Create expect script for SSH
$expectScript = @"
spawn ssh $username@$hostname
expect "password:"
send "$password\r"
interact
"@

# Write expect script to file
$expectScript | Out-File -FilePath "ssh_connect.exp" -Encoding ASCII

# Try to run with expect if available
try {
    expect ssh_connect.exp
} catch {
    Write-Host "Expect not available, trying manual connection..."
    Write-Host "Please run: ssh $username@$hostname"
    Write-Host "Password: $password"
}

