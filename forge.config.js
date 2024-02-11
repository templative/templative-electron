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
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     background: './assets/dmg-background.png',
    //     format: 'ULFO'
    //   }
    // },
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
