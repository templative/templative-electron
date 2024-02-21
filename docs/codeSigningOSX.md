
# Signing

- Create an Apple Developer Account
- Install XCode
- [What is app signing?](https://help.apple.com/xcode/mac/current/#/dev3a05256b8)
- [Code Signing](https://help.apple.com/xcode/mac/current/#/devfbe995ebf)
- Create a [Signing Request](https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request). Save it to disk.
- Create a [Developer Id Certificates](https://developer.apple.com/help/account/create-certificates/create-developer-id-certificates/) using the CSRequest generated above.
- Download it, double click, add it to your keychain at the System level.
- Confirm its there under your LLC using `security find-identity -p codesigning -v`
- Templative uses Python 

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