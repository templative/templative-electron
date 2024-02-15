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
      "./bin",
      "./build"
     ],
    icon: "assets/images/icon",
  },
  rebuildConfig: {},
  makers: [
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
