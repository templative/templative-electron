module.exports = {
  packagerConfig: {
    name: 'Templative',
		executableName: 'Templative',
    asar: true,
    osxUniversal: { // config options for `@electron/universal`
      x64ArchFiles: '*' // replace with any relevant glob pattern
    },
    extraResource: [
      "assets/images/icon.icns",
      "./bin"
     ],
    icon: "assets/images/icon",
    osxSign: {
      'identity': "Developer ID Application: Next Day Games LLC (Y9RWBVMY7R)",
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      'entitlements': 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.TEMPLATIVE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  rebuildConfig: {},
  makers: [
    // {
    //   name: '@electron-forge/maker-dmg',
    //   platforms: ['darwin'],
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: (arch) => ({
        macUpdateManifestBaseUrl: `https://templative-artifacts.s3.amazonaws.com/darwin/${arch}`
      })
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: (arch) => ({
        name: "templative",
        authors: "Next Day Games",
        noMsi: true,
        remoteReleases: `https://templative-artifacts.s3.amazonaws.com/win32/${arch}`
      })
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
        renderer: {
          nodeIntegration: true,
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      platforms: ['darwin', 'win32'],
      config: {
        bucket: 'templative-artifacts',
        folder: '',
        region: 'us-west-2',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        keyResolver: (fileName, platform, arch) => {
          return `${platform}/${arch}/${fileName}`
        }
      }
    }
  ]
};
