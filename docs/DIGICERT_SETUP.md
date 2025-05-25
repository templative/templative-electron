# DigiCert Code Signing Setup Guide

This guide will help you migrate from Azure SignTool to DigiCert Software Trust Manager for automatic code signing in your GitHub Actions workflow.

## What Changed

We've replaced the Azure SignTool setup with DigiCert Software Trust Manager, which provides:
- **Cloud-based HSM**: FIPS 140-2 Level 2 compliant key storage
- **Better integration**: Official DigiCert GitHub Action
- **Multi-factor authentication**: Built-in security
- **Cost-effective**: More affordable than Azure HSM solutions

## Prerequisites

1. **DigiCert ONE Account**: Sign up at [DigiCert ONE](https://one.digicert.com)
2. **Code Signing Certificate**: Purchase a DigiCert Code Signing certificate with KeyLocker (cloud HSM)
3. **Certificate Authority**: Your certificate must be issued by DigiCert

## Step 1: Create DigiCert Credentials

### 1.1 Create API Token
1. Sign in to DigiCert ONE
2. Click the **profile icon** (top-right)
3. Select **Admin Profile**
4. Scroll down to **API Tokens**
5. Click **Create API token**
6. **Important**: Save this token immediately - it's only shown once!

### 1.2 Create Authentication Certificate
1. In DigiCert ONE, go to **Admin Profile**
2. Scroll down to **Authentication certificates**
3. Click **Create authentication certificate**
4. **Important**: Download the certificate and save the password - you can't access it again!

### 1.3 Convert Certificate to Base64
**On Windows (PowerShell):**
```powershell
$fileContentBytes = get-content 'path/to/your/certificate.p12' -Encoding Byte
[System.Convert]::ToBase64String($fileContentBytes)
```

**On macOS/Linux:**
```bash
base64 path/to/your/certificate.p12
```

### 1.4 Get Certificate Fingerprint
1. In DigiCert ONE, go to **Certificates**
2. Find your code signing certificate
3. Copy the **SHA1 fingerprint** (it's the certificate thumbprint)

## Step 2: Update GitHub Secrets

### Remove Old Azure Secrets
Delete these Azure-related secrets from your GitHub repository:
- `AZURE_KEY_VAULT_URL`
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_KEY_VAULT_CERTIFICATE`

### Add New DigiCert Secrets
Go to your GitHub repository **Settings > Secrets and variables > Actions** and add:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SM_API_KEY` | `your-api-token` | API token from Step 1.1 |
| `SM_CLIENT_CERT_FILE_B64` | `base64-encoded-certificate` | Base64 certificate from Step 1.3 |
| `SM_CLIENT_CERT_PASSWORD` | `certificate-password` | Password from Step 1.2 |
| `SM_HOST` | `https://clientauth.one.digicert.com` | DigiCert ONE host (use this for production) |
| `SM_CODE_SIGNING_CERT_SHA1_HASH` | `certificate-fingerprint` | SHA1 fingerprint from Step 1.4 |

### Host Environment Options
- **Production**: `https://clientauth.one.digicert.com`
- **Demo/Test**: `https://clientauth.demo.one.digicert.com`

## Step 3: Test the Setup

1. Push a commit to trigger the workflow
2. Check the Windows job in GitHub Actions
3. Look for these steps:
   - ✅ Setup DigiCert Software Trust Manager
   - ✅ Setup DigiCert Certificate
   - ✅ Set DigiCert Variables
   - ✅ Sign the Windows Setup.exe with DigiCert
   - ✅ Verify code signing

## Troubleshooting

### Common Issues

**1. Authentication Failed**
- Verify your `SM_API_KEY` is correct
- Check that `SM_CLIENT_CERT_PASSWORD` matches the certificate password
- Ensure `SM_HOST` uses the correct environment (prod vs demo)

**2. Certificate Not Found**
- Verify `SM_CODE_SIGNING_CERT_SHA1_HASH` matches your certificate fingerprint
- Check that the certificate is active in DigiCert ONE

**3. Base64 Encoding Issues**
- Make sure there are no extra spaces or newlines in `SM_CLIENT_CERT_FILE_B64`
- Re-encode the certificate if needed

**4. Permission Issues**
- Ensure your DigiCert account has "Certificate Profile Signer" role
- Check that the certificate profile allows signing

### Debugging Steps

1. **Check DigiCert Setup**:
   ```bash
   # The workflow will show if smctl is properly installed
   smctl --version
   ```

2. **Verify Authentication**:
   ```bash
   # The workflow will test authentication with DigiCert
   smctl keypair list
   ```

3. **Test Certificate Access**:
   ```bash
   # Check if certificate is accessible
   smctl certificate list
   ```

## Benefits of DigiCert vs Azure SignTool

| Feature | DigiCert | Azure SignTool |
|---------|----------|----------------|
| **Setup Complexity** | Simple | Complex |
| **Cost** | Lower | Higher (requires Azure HSM) |
| **GitHub Integration** | Official Action | Manual setup |
| **Key Security** | FIPS 140-2 Level 2 | FIPS 140-2 Level 2 |
| **Multi-factor Auth** | Built-in | Requires setup |
| **Timestamping** | Built-in | Manual configuration |

## Support

- **DigiCert Support**: [DigiCert Support Portal](https://support.digicert.com/)
- **GitHub Action**: [DigiCert SSM Code Signing](https://github.com/marketplace/actions/code-signing-with-software-trust-manager)
- **Documentation**: [DigiCert Docs](https://docs.digicert.com/)

## Next Steps

After successful setup, consider:
1. **Monitor usage**: Check DigiCert ONE dashboard for signing activity
2. **Set up notifications**: Configure alerts for certificate expiration
3. **Review security**: Regularly audit who has access to signing credentials
4. **Plan renewal**: Set reminders for certificate renewal (typically 1-3 years) 