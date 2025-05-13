module.exports = {
  packagerConfig: {
    name: 'Templative',
		executableName: 'Templative',
    "asar": {
      "unpack": "**/{*.node,node_modules/@resvg/**/*}"
    },
    osxUniversal: false, // We'll build separate x64 and arm64 packages instead
    arch: process.env.ARCH || undefined, // Use the ARCH environment variable
    extraResource: [
      "./src/main/templative/lib/componentTemplates",
    ],
    icon: "src/assets/images/icon",
    osxSign: process.env.SKIP_SIGNING === 'true' ? false : {
      'identity': "Developer ID Application: Go Next Games LLC (829PN2W7LK)",
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      'entitlements': 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library'
    },
    osxNotarize: process.env.SKIP_SIGNING === 'true' ? false : {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.TEMPLATIVE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
      debug: true,
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
        macUpdateManifestBaseUrl: `https://templative-artifacts.s3.amazonaws.com/darwin/${arch}`,
      }),
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: (arch) => ({
        name: "templative",
        authors: "Go Next Games",
        noMsi: true,
        noDelta: false,
        remoteReleases: `https://templative-artifacts.s3.amazonaws.com/win32/${arch}`,
        setupIcon: 'src/assets/images/icon.ico',        
        iconUrl: 'https://drive.google.com/uc?export=download&id=1kZ7VRV_A_cwG6mPIS1HUXKFWViW5y3-J',
        allowElevation: true,
        noPrompt: true,
      }),
    },
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
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval' sentry-ipc:",
        devServer: {
          hot: true,
          liveReload: false
        },
        renderer: {
          nodeIntegration: true,
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/renderer.js',
              name: 'main_window'
            }
          ],
        },
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      platforms: [ 'darwin', 'win32'],
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
