#!/bin/bash

echo "🔐 Generating SSL certificates..."

# Create directories
mkdir -p ssl/certs ssl/private

# Generate private key
openssl genrsa -out ssl/private/server.key 2048

# Generate self-signed certificate
openssl req -new -x509 -key ssl/private/server.key -out ssl/certs/server.crt -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Set permissions
chmod 600 ssl/private/server.key
chmod 644 ssl/certs/server.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Private key: ssl/private/server.key"
echo "📁 Certificate: ssl/certs/server.crt"
echo ""
echo "🚀 Now run: docker-compose up --build" 