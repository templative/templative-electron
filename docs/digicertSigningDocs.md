Install client tools for standard keypair signing on GitHub
Code Signing with DigiCert​​®​​ Software Trust Manager GitHub action streamlines the keypair-based signing process, improving software security while seamlessly integrating with DevOps processes. This action supports signing binaries on both Windows and Linux platforms.

This GitHub action automates the installation and configuration of Software Trust Manager client tools, enabling developers to quickly become signing-ready for GitHub action workflows.

Which client tools will be installed and configured?

Signing Manager CTL (SMCTL)

SMCTL provides a Command Line Interface (CLI) that facilitates manual or automated private key, certificate management, and signing with or without the need for human intervention.

PKCS11 library

The PKCS11 library handles secure key generation, application hash signing, and associated certificate-related requirements when the signing request does not require the transportation of files and intellectual property.

KSP library

DigiCert​​®​​ Software Trust Manager KSP is a Microsoft CNG (Cryptographic: Next Generation) library-based client-side tool. The KSP takes a hash-based approach when signing requests that do not require transportation of your files and intellectual property.

JCE library

The JCE library is used for signing with Jarsigner and integrates with any operating system that supports Java.

Prerequisites
Windows or Linux operating system

Software Trust Manager account

Get the latest version of Code Signing with Software Trust Manager plugin from GitHub Marketplace

DigiCert ONE host

DigiCert ONE API key

Integrate third-party signing tools

Fingerprint of publicly trusted code signing certificate

Procedure
To use this plugin, follow these steps:

Go to Code Signing with Software Trust Manager in GitHub Marketplace.

Select Use the latest version.

Select the Copy icon to copy the plugin snippet.

Paste the plugin snippet into your .yml file.

Run your CI/CD pipeline in GitHub.

User authentication
Software Trust Manager enforces multifactor authentication for security. To access keypairs, certificates, and sign code, you need to set up two types of credentials: an API token and an authentication certificate.

Create an API token
The API token is an authentication method used to verify you as a user and your permissions assigned in DigiCert ONE. The API token provides the first factor authentication.

Follow these steps to generate an API token:

Sign in to DigiCert ONE.

Select the profile icon (top-right).

Select Admin Profile.

Scroll down to API Tokens.

Select  Create API token.

The API token is only shown once, securely store the API key to use it later.

Create an authentication certificate
The client authentication certificate is an authentication method used to verify you as a user and your permissions assigned in DigiCert ONE. The client authentication certificate provides the second factor authentication.

Follow these steps to create a client authentication certificate:

Sign in to DigiCert ONE.

Select the profile icon (top-right).

Select Admin Profile.

Scroll down to Authentication certificates.

Select Create authentication certificate.

The client authentication certificate password shown after creating an client authentication certificate cannot be accessed again, download the certificate and securely store the password to use it later.

Convert your client authentication certificate to a base64 string
To add a client authentication certificate to GitHub secrets, it needs to be encoded as a base64 string. The following commands demonstrate how to achieve this based on your operating system.

WindowsLinux
In PowerShell, run:

 $fileContentBytes = get-content 'YOURFILEPATH.p12' -Encoding Byte 

 [System.Convert]::ToBase64String($fileContentBytes) 
Secure GitHub use
For secure GitHub usage with Software Trust Manager, we recommend using secrets and secure files. This ensures security and accountability for your GitHub users, particularly when they are using Software Trust Manager for code signing. Follow these instructions to set up GitHub secrets.

The code examples provided in this article assumes that you are using secrets and secure files.

GitHub secrets
GitHub Secrets allows you to encrypt variables so users can input sensitive information without exposing the actual values. For example, you can hide your API keys while still allowing collaborators to use them for signing tools through Software Trust Manager. GitHub secrets are commonly used in GitHub Actions workflows to make sensitive or configuration-related information available to various steps without exposing it directly in the workflow file.

Configure GitHub secrets
Configure your credentials to encrypt them in GitHub Secrets and connect to DigiCert​​®​​ Software Trust Manager.

When you save credentials as a secret, it becomes fully encrypted, even the creator (you) cannot access it. If you anticipate needing it in the future, be sure to store it separately.

Follow these steps to configure your credentials in GitHub secrets:

Access GitHub repository.

Navigate to: Settings > Secrets > Actions.

Select New repository secret.

Create a repository secret for each of the following credentials:

Name

Value

SM_CLIENT_CERT_PASSWORD

Insert the password that you were shown when you created your client authentication certificate above.

SM_CLIENT_CERT_FILE_B64

Insert the base64 encoded string of your client authentication certificate that you created above.

SM_HOST

The path to the DigiCert ONE portal with client authorization.  The SM_HOST value you use depends on whether you are using demo or prod.

For assistance, refer to host environment.

SM_API_KEY

Insert the API token you created above.

SM_CODE_SIGNING_CERT_SHA1_HASH

The certificate fingerprint.

Set up environment variables
Once you have stored your credentials in GitHub secrets, use the code snippets below to set up your environment variables.

Decode your base64-encoded client authentication certificate
Use the snippet below to decode your base64-encoded client authentication certificate stored in a GitHub secret (SM_CLIENT_CERT_FILE_B64) and saves it as a PKCS#12 certificate file named "Certificate_pkcs12.p12" in the /d/ directory for later use in the workflow.

- name: Set up certificate 

  run: | 
    echo "${{ secrets.SM_CLIENT_CERT_FILE_B64 }}" | base64 --decode > /d/Certificate_pkcs12.p12 
  shell: bash 
Configure environment variables
Use this code snippet to configure the necessary environment variables that are used in subsequent steps of this workflow to perform code signing.

- name: Set variables 
  id: variables 
  run: | 
    echo "version=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT 
    echo "SM_HOST=${{ secrets.SM_HOST }}" >> "$GITHUB_ENV" 
    echo "SM_API_KEY=${{ secrets.SM_API_KEY }}" >> "$GITHUB_ENV" 
    echo "SM_CLIENT_CERT_FILE=D:\\Certificate_pkcs12.p12" >> "$GITHUB_ENV" 
    echo "SM_CLIENT_CERT_PASSWORD=${{ secrets.SM_CLIENT_CERT_PASSWORD }}" >> "$GITHUB_ENV" 
  shell: bash
Client tools setup
Follow these steps to set up DigiCert​​®​​ Software Trust Manager client tools securely.

Ensure that the third-party signing tools you want to use are already installed before proceeding with this step.

Initiate the client tools setup
The following code snippet installs and configures DigiCert​​®​​ Software Trust Manager client tools, including SMCTL, PKCS#11 library, and Software Trust Manager KSP library.

Various signing tools, such as Mage, Nuget, Signtool, and Jarsigners are also useable via SMCTL; these tools do not need to be installed or set up separately.

- name: Install DigiCert Client tools from Github Custom Actions marketplace
        id: Digicert Code Signing Snippet
        uses: digicert/ssm-code-signing@v1.0.0
The PKCS11library will be installed at:

C:\Users\RUNNER~1\AppData\Local\Temp\smtools-windows-x64\smpkcs11.dll
The PKCS11 configuration file can be found at:

C:\Users\RUNNER~1\AppData\Local\Temp\smtools-windows-x64\pkcs11properties.cfg
Signing using GitHub action
To sign using a certificate fingerprint:

- name: Signing using certificate fingerprint      
        run: |
           smctl sign --fingerprint ${{ secrets.SM_CODE_SIGNING_CERT_SHA1_HASH }} --input path/to/unsignedfile.extension --config-file path/to/pkcs11properties.cfg
        shell: cmd
To sign using a keypair alias:

- name: Signing using keypair alias
        run: |
           smctl sign --keypair-alias YourKeypairAlias --input path/to/unsignedfile.extension --config-file path/to/pkcs11properties.cfg
        shell: cmd
Code signing using GitHub actions custom plugin template
name: Code Signing Template
 
on: 
  workflow_dispatch:
 
jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [windows-latest]

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v4 
     
      - name: Install DigiCert Client tools from Github Custom Actions marketplace
        id: Digicert Code Signing Snippet
        uses: digicert/ssm-code-signing@v1.0.0
   
      - name: Set up certificate 
        run: | 
          echo "${{ secrets.SM_CLIENT_CERT_FILE_B64 }}" | base64 --decode > /d/Certificate_pkcs12.p12 
        shell: bash  
        
      - name: Set variables 
        id: variables 
        run: | 
          echo "version=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT 
          echo "SM_HOST=${{ secrets.SM_HOST }}" >> "$GITHUB_ENV" 
          echo "SM_API_KEY=${{ secrets.SM_API_KEY }}" >> "$GITHUB_ENV" 
          echo "SM_CLIENT_CERT_FILE=D:\\Certificate_pkcs12.p12" >> "$GITHUB_ENV" 
          echo "SM_CLIENT_CERT_PASSWORD=${{ secrets.SM_CLIENT_CERT_PASSWORD }}" >> "$GITHUB_ENV" 
        shell: bash

      - name: Signing using certificate fingerprint      
        run: |
           smctl sign --fingerprint ${{ secrets.SM_CODE_SIGNING_CERT_SHA1_HASH }} --input path/to/unsignedfile.extension --config-file path/to/pkcs11properties.cfg
        shell: cmd

      
      - name: Signing using keypair alias
        run: |
           smctl sign --keypair-alias YourKeypairAlias --input path/to/unsignedfile.extension --config-file path/to/pkcs11properties.cfg
        shell: cmd
