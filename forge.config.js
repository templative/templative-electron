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
      "./build",
      "./python"
     ],
    icon: "assets/images/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      // config: {
      //   background: './assets/dmg-background.png',
      //   format: 'ULFO'
      // }
    },
    {
      name: '@electron-forge/maker-zip',
      config: (arch) => ({
        macUpdateManifestBaseUrl: `https://templative-artifacts.s3.us-west-2.amazonaws.com/darwin/${arch}`
      })
    },
    {
      name: '@electron-forge/maker-squirrel',
      // config: {
      //   certificateFile: './cert.pfx',
      //   certificatePassword: process.env.CERTIFICATE_PASSWORD
      // },
      config: (arch) => ({
        remoteReleases: `https://templative-artifacts.s3.us-west-2.amazonaws.com/win32/${arch}`
      })
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      platforms: ['darwin', 'win32'],
      config: {
        bucket: 'templative-artifacts',
        folder: '', // We prefix to add to all files like 'artifacts' to create ./artifacts/fileName
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
