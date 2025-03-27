- name: Sign Executable with Azure Trusted Signing
        uses: Azure/trusted-signing-action@v0.5.1
        with:
          azure-tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          azure-client-id: ${{ secrets.AZURE_CLIENT_ID }}
          azure-client-secret: ${{ secrets.AZURE_CLIENT_SECRET }}
          
          # You'll need to set up these values in your Azure Trusted Signing account
          endpoint: "https://eus.codesigning.azure.net/" # Replace with your region's endpoint
          trusted-signing-account-name: "YourTrustedSigningAccountName" # Replace with your account name
          certificate-profile-name: ${{ secrets.AZURE_KEY_VAULT_CERTIFICATE }}
          
          # Specify the files to sign - adjust the path as needed
          files: "./path/to/your/executable.exe"
          
          # Optional but recommended settings
          description: "Templative - Board Game Production"
          timestamp-rfc3161: "http://timestamp.acs.microsoft.com"
          timestamp-digest: "SHA256"
          file-digest: "SHA256"