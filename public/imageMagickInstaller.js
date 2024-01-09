const installImageMagick = () => {
    var resourcePath = app.isPackage ? process.resourcesPath : "."
    var imageMagickParentDirectory = `${resourcePath}/bin`
    var imageMagickTar = `${imageMagickParentDirectory}/ImageMagick-x86_64-apple-darwin20.1.0.tar.gz`
    var imageMagickOutputDirectory = `${imageMagickParentDirectory}/ImageMagick-7.0.10`
    // if (fs.existsSync(imageMagickOutputDirectory)) {
    //   console.log(`${imageMagickOutputDirectory} already exists.`)
    //   return 
    // }
    var commands = [
      // `tar xvzf ${imageMagickTar} -C ${imageMagickParentDirectory}`,
      `export MAGICK_HOME="${imageMagickOutputDirectory}"`,
      `export PATH="$MAGICK_HOME/bin:$PATH"`,
      `export DYLD_LIBRARY_PATH="$MAGICK_HOME/lib/"`
    ]
    // console.log("Installing ImageMagick")
    commands.forEach((command) => {
      spawn(command, {stdio: "inherit", shell: true})
      console.log(command)
    })
    // console.log(command)
  }
module.exports = {
    installImageMagick: installImageMagick
}