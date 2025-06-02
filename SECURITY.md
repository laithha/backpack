# Security Setup Guide

## 🔒 SSL/TLS Configuration

This application uses self-signed SSL certificates with Nginx reverse proxy for enhanced security.

### Features Implemented:

#### **SSL/TLS Security:**
- ✅ TLS 1.2 and 1.3 support
- ✅ Strong cipher suites
- ✅ HTTP to HTTPS redirect
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ SSL session management

#### **Security Headers:**
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Content Security Policy (CSP)
- ✅ Referrer Policy

#### **Rate Limiting:**
- ✅ API endpoints: 10 requests/second
- ✅ Login endpoint: 5 requests/minute
- ✅ Burst protection

#### **Additional Security:**
- ✅ Reverse proxy isolation
- ✅ Request size limits (10MB)
- ✅ Gzip compression
- ✅ Health check endpoint

## 🚀 Setup Instructions

### **Step 1: Generate SSL Certificates**

#### For Windows (PowerShell):
```powershell
# Make sure OpenSSL is installed
# Download from: https://slproweb.com/products/Win32OpenSSL.html

# Run the PowerShell script
.\ssl\generate-ssl.ps1
```

#### For Linux/Mac (Bash):
```bash
# Make the script executable
chmod +x ssl/generate-ssl.sh

# Run the script
./ssl/generate-ssl.sh
```

### **Step 2: Start the Secure Stack**
```bash
# Start all services with SSL
docker-compose up -d

# Check status
docker-compose ps
```

### **Step 3: Access Your Application**
- **HTTPS URL:** https://localhost
- **HTTP (redirects to HTTPS):** http://localhost

## 🔧 Configuration Files

### **Nginx Configuration:** `nginx/nginx.conf`
- SSL termination
- Reverse proxy to Node.js app
- Security headers
- Rate limiting

### **Docker Compose:** `docker-compose.yml`
- Nginx reverse proxy
- SSL certificate mounting
- Network isolation
- Service dependencies

### **SSL Certificates:** `ssl/`
- `ssl/certs/server.crt` - SSL certificate
- `ssl/private/server.key` - Private key
- `ssl/certs/server.csr` - Certificate signing request

## 🛡️ Security Best Practices

### **Certificate Management:**
1. **Self-signed certificates** are for development/testing
2. For production, use **Let's Encrypt** or **commercial certificates**
3. Rotate certificates before expiration (365 days)
4. Keep private keys secure (600 permissions)

### **Environment Variables:**
```bash
# Update these in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
DATABASE_URL=postgresql://admin:admin@postgres:5432/backpack
```

### **Database Security:**
- Use strong passwords
- Enable SSL for database connections
- Regular backups
- Network isolation

### **Application Security:**
- 2FA enabled for user accounts
- Password reset functionality
- JWT token management
- Input validation

## 🔍 Monitoring & Logs

### **Nginx Logs:**
```bash
# Access logs
docker exec mpp-nginx-proxy tail -f /var/log/nginx/access.log

# Error logs
docker exec mpp-nginx-proxy tail -f /var/log/nginx/error.log
```

### **Application Logs:**
```bash
# Application logs
docker logs mpp-webb-main -f

# Database logs
docker logs mpp_container_postgres -f
```

## 🚨 Troubleshooting

### **Common Issues:**

#### **Certificate Warnings:**
- Browser will show "Not Secure" for self-signed certificates
- Click "Advanced" → "Proceed to localhost (unsafe)"
- This is normal for development environments

#### **SSL Connection Errors:**
```bash
# Check certificate validity
openssl x509 -in ssl/certs/server.crt -text -noout

# Test SSL connection
openssl s_client -connect localhost:443 -servername localhost
```

#### **Nginx Configuration Test:**
```bash
# Test configuration
docker exec mpp-nginx-proxy nginx -t

# Reload configuration
docker exec mpp-nginx-proxy nginx -s reload
```

## 📋 Security Checklist

- [ ] SSL certificates generated
- [ ] Nginx reverse proxy running
- [ ] HTTPS redirect working
- [ ] Security headers present
- [ ] Rate limiting active
- [ ] Strong passwords set
- [ ] 2FA enabled for accounts
- [ ] Database secured
- [ ] Logs monitored
- [ ] Regular security updates

## 🔄 Production Deployment

For production deployment:

1. **Use real SSL certificates** (Let's Encrypt)
2. **Update environment variables**
3. **Enable firewall rules**
4. **Set up monitoring**
5. **Regular security audits**
6. **Backup strategies**

---

**Note:** This setup provides a solid security foundation for development and testing. For production environments, additional security measures should be implemented based on your specific requirements. 