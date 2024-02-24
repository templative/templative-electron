
# Signing

- Create an Apple Developer Account
- Install XCode
- Create a [Signing Request](https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request). Save it to disk.
  - Launch Keychain Access located in /Applications/Utilities.
  - Choose Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority.
  - In the Certificate Assistant dialog, enter an email address in the User Email Address field.
  - In the Common Name field, enter a name for the key (for example, Gita Kumar Dev Key).
  - Leave the CA Email Address field empty.
  - Choose “Saved to disk,” then click Continue.
- Create a [Developer Id Certificate](https://developer.apple.com/help/account/create-certificates/create-developer-id-certificates/)
  - In [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources), click Certificates in the sidebar.
  - On the top left, click the add button (+).
  - Under Software, select Developer ID, then click Continue.
  - Developer ID Application: A certificate used to sign a Mac app.
  - Click Choose File.
  - In the dialog that appears, select the certificate request file (a file with a .certSigningRequest file extension), then click Choose.
  - Click Continue.
  - Click Download.
  - The certificate file (a file with a .cer file extension) appears in your Downloads folder.
  - To install the certificate in your keychain, double-click the downloaded certificate file. The certificate appears in the My Certificates category in Keychain Access.
- Download it, double click, add it to your keychain at the System level.
- Confirm its there under your LLC using `security find-identity -p codesigning -v`

# Notarizing

- Find your [apple team id](https://developer.apple.com/account) under Membership Details > Team ID
- Create an [app specific password](https://appleid.apple.com/account/manage)
- Despite the name, appleIdPassword is not the password for your Apple ID account.
- Add it to [github secrets](https://github.com/templative/templative-electron/settings/secrets/actions).
- To see issues `export DEBUG=electron*`

# Checking your Notarizations

- Following [creating an api key](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api)
- Go to [Users > Access > Integrations](https://appstoreconnect.apple.com/access/integrations/api)
- Create an app store connect api key as admin
- Download it, name it something
- `xcrun notarytool store-credentials`
- Give the name of the api key, the file location of the downloaded file, the key id of api key, and the issuer id of the api keys. 
- `xcrun notarytool history --keychain-profile "NextDayGamesAPIKey"`

# Forge Config

```
packagerConfig: {
    ...
    osxSign: {
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      'entitlements': 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.TEMPLATIVE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    },
}
```

Reference:
- [What is app signing?](https://help.apple.com/xcode/mac/current/#/dev3a05256b8)
- [Code Signing](https://help.apple.com/xcode/mac/current/#/devfbe995ebf)
- [Getting it to work with continuous integration](https://shipshape.io/blog/signing-electron-apps-with-github-actions/)
- [How to Create Developer Certificates](https://developer.apple.com/help/account/create-certificates/create-developer-id-certificates/)
- [Creating a Certificate Request](https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request)
- [What Electron uses to Sign](https://github.com/electron/osx-sign)
- [What Electron uses to Notarize](https://github.com/electron/osx-notarize)
- [Your apple developer account homepage](https://developer.apple.com/account)
- [Your apple id management homepage](https://appleid.apple.com/account/manage)
- [Electron's Code Signing Tips](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- [Your Developer Certificates](https://developer.apple.com/account/resources/certificates/list)
- [The difference between Development and Distribution certificates](https://help.apple.com/xcode/mac/current/#/dev3a05256b8)
- [Changes to Gatekeeper that now require Notarization](https://developer.apple.com/developer-id/)
- [Stuck in progress?](https://forums.developer.apple.com/forums/thread/736977)
- [Fetching notary log](https://forums.developer.apple.com/forums/thread/705839)