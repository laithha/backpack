# PowerShell script to generate SSL certificates for Windows

Write-Host "Generating SSL certificates..." -ForegroundColor Yellow

# Check if OpenSSL is available
try {
    $opensslVersion = & openssl version
    Write-Host "OpenSSL found: $opensslVersion" -ForegroundColor Green
} catch {
    Write-Host "OpenSSL not found. Please install OpenSSL first." -ForegroundColor Red
    Write-Host "You can download it from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host "Or install via Chocolatey: choco install openssl" -ForegroundColor Yellow
    exit 1
}

# Create directories
New-Item -ItemType Directory -Force -Path "ssl\certs" | Out-Null
New-Item -ItemType Directory -Force -Path "ssl\private" | Out-Null

# Generate private key
Write-Host "Generating private key..." -ForegroundColor Yellow
& openssl genrsa -out ssl\private\server.key 2048

# Generate self-signed certificate
Write-Host "Generating self-signed certificate..." -ForegroundColor Yellow
& openssl req -new -x509 -key ssl\private\server.key -out ssl\certs\server.crt -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

Write-Host "SSL certificates generated successfully!" -ForegroundColor Green
Write-Host "Private key: ssl\private\server.key" -ForegroundColor Cyan
Write-Host "Certificate: ssl\certs\server.crt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now run: docker-compose up --build" -ForegroundColor Yellow 