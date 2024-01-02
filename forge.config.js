module.exports = {
  packagerConfig: {
    name: 'Templative',
		executableName: 'Templative',
    asar: true,
    extraResource: [
      "assets/images/icon.icns",
      "./build",
      "./bin",
      "./python"
     ],
    icon: "assets/images/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: 'assets/images/icon.icns'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
