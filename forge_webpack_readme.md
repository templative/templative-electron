Webpack Plugin
Transform and bundle code for your Electron Forge app with webpack.

This plugin makes it easy to set up standard webpack tooling to compile both your main process code and your renderer process code, with built-in support for Hot Module Replacement (HMR) in the renderer process and support for multiple renderers.

Installation
Copy
npm install --save-dev @electron-forge/plugin-webpack
Usage
Plugin configuration
You must provide two webpack configuration files: one for the main process in mainConfig, and one for the renderer process in renderer.config. The complete config options are available in the API docs under WebpackPluginConfig.

For example, this is the configuration taken from Forge's webpack template:

forge.config.js
package.json
Copy
module.exports = {
  // ...
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [{
            name: 'main_window',
            html: './src/renderer/index.html',
            js: './src/renderer/index.js',
            preload: {
              js: './src/preload.js'
            }
          }]
        }
      }
    }
  ]
  // ...
};
Project files
This plugin generates a separate entry for the main process, as well as each renderer process and preload script.

You need to do two things in your project files in order to make this plugin work.

package.json
First, your main entry in your package.json file needs to point at "./.webpack/main" like so:

package.json
Copy
{
  "name": "my-app",
  "main": "./.webpack/main",
  // ...
}
Main process code
Second, all loadURL and preload paths need to reference the magic global variables that this plugin will define for you.

Each entry point has two globals defined based on the name assigned to your entry point:

The renderer's entry point will be suffixed with _WEBPACK_ENTRY

The renderer's preload script will be suffixed with _PRELOAD_WEBPACK_ENTRY

In the case of the main_window entry point in the earlier example, the global variables will be named MAIN_WINDOW_WEBPACK_ENTRY and MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY. An example of how to use them is given below:

main.js
Copy
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
  }
});

mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
These variables are only defined in the main process. If you need to use one of these paths in a renderer (e.g. to pass a preload script to a <webview> tag), you can pass the magic variable value with a synchronous IPC round trip.

Main Process
Preload Script
Renderer Process
main.js
Copy
// make sure this listener is set before your renderer.js code is called
ipcMain.on('get-preload-path', (e) => {
  e.returnValue = WINDOW_PRELOAD_WEBPACK_ENTRY;
});
Usage with TypeScript

If you're using the webpack plugin with TypeScript, you will need to manually declare these magic variables to avoid compiler errors.

main.js (Main Process)
Copy
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
Advanced configuration
webpack-dev-server
Forge's webpack plugin uses webpack-dev-server to help you quickly iterate on renderer process code in development mode. Running electron-forge start with the webpack plugin active will launch a dev server that is configurable through the plugin config.

devServer
In development mode, you can change most webpack-dev-server options by setting devServer in your Forge Webpack plugin configuration.

Plugin configuration
Copy
{
  name: '@electron-forge/plugin-webpack',
  config: {
    // other Webpack plugin config...
    devServer: {
      stats: 'verbose'
    }
    // ...
  }
}
devContentSecurityPolicy
In development mode, you can set a Content Security Policy (CSP) by setting devContentSecurityPolicy in your Forge Webpack plugin configuration.

Copy
{
  name: '@electron-forge/plugin-webpack',
  config: {
    // other Webpack plugin config...
    devContentSecurityPolicy: 'default-src \'self\' \'unsafe-inline\' data:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:',
    // other Webpack plugin config...
    mainConfig: './webpack.main.config.js',
    renderer: {
      /* renderer config here, see above section */
    }
  }
}
If you wish to use source maps in development, you'll need to set 'unsafe-eval' for the script-src directive. Using 'unsafe-eval' will cause Electron itself to trigger a warning in the DevTools console about having that value enabled, which is usually fine so long as you do not set that value in production.

Native Node modules
If you used the Webpack or TypeScript + Webpack templates to create your application, native modules will mostly work out of the box.

If you are setting up the plugin manually, you can make native modules work by adding the following two loaders to your module.rules configuration in your Webpack config. Ensure you install both node-loader and @vercel/webpack-asset-relocator-loader as development dependencies.

Copy
npm install --save-dev node-loader @vercel/webpack-asset-relocator-loader@1.7.3
Electron Forge monkeypatches the asset relocator loader in order for it to work with Electron properly, so the version has been pinned to ensure compatibility. If you upgrade that version, you do so at your own risk.

webpack.main.config.js
Copy
module.exports = {
  module: {
    rules: [
      {
        // We're specifying native_modules in the test because the asset
        // relocator loader generates a "fake" .node file which is really
        // a cjs file.
        test: /native_modules\/.+\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules'
          }
        }
      }
    ]
  }
};
If the asset relocator loader does not work for your native module, you may want to consider using webpack's externals configuration.

Node integration
Enabling Node integration in your app code
In Electron, you can enable Node.js in the renderer process with BrowserWindow constructor options. Renderers with the following options enabled will have a browser-like web environment with access to Node.js require and all of its core APIs:

main.js (Main Process)
Copy
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: false,
    nodeIntegration: true
  }
});
This creates a unique environment that requires additional webpack configuration.

Setting the correct webpack target in your plugin config
Webpack targets have first-class support for various Electron environments. Forge's webpack plugin will set the compilation target for renderers based on the nodeIntegration option in the config:

When nodeIntegration is true, the target is electron-renderer.

When nodeIntegration is false, the target is web.

This option is false by default**.** You can set this option for all renderers via the renderer.nodeIntegration option, and you can override its value in each renderer you create in the entryPoints array.

In the below configuration example, webpack will compile to the electron-renderer target for all entry points except for media_player, which will compile to the web target.

Plugin configuration
Copy
{
  name: '@electron-forge/plugin-webpack',
  config: {
    mainConfig: './webpack.main.config.js',
    renderer: {
      config: './webpack.renderer.config.js',
      nodeIntegration: true, // Implies `target: 'electron-renderer'` for all entry points
      entryPoints: [
        {
          html: './src/app/app.html',
          js: './src/app/app.tsx',
          name: 'app'
        },
        {
          html: './src/mediaPlayer/index.html',
          js: './src/mediaPlayer/index.tsx',
          name: 'media_player',
          nodeIntegration: false // Overrides the default nodeIntegration set above
        }
      ]
    }
  }
}
It is important that you enable nodeIntegration in both in the main process code and the webpack plugin configuration. This option duplication is necessary because webpack targets are fixed upon compilation, but BrowserWindow's web preferences are determined on run time.

Hot module replacement
In development mode, all your renderer processes in development will have Hot Module Replacement (HMR) enabled by default thanks to webpack-dev-server.

However, it is impossible for HMR to work inside preload scripts. However, webpack is constantly watching and recompiling those files so reload the renderer to get updates for preload scripts.

For the main process, type rs in the console you launched electron-forge from and Forge will restart your app for you with the new main process code.

Hot reload caching
When using Webpack 5 caching, asset permissions need to be maintained through their own cache, and the public path needs to be injected into the build.

To insure these cases work out, make sure to run initAssetCache in the build, with the options.outputAssetBase argument:

Copy
const relocateLoader = require('@vercel/webpack-asset-relocator-loader');
webpack({
  // ...
  plugins: [
    {
      apply (compiler) {
        compiler.hooks.compilation.tap('webpack-asset-relocator-loader', compilation => {
          relocateLoader.initAssetCache(compilation, outputAssetBase);
        });
      }
    }
  ]
});
Hot Reloading for React
If you're using React components, you may want to have HMR automatically pick up a change and reload the component without having to manually refresh the page. This is possible by installing react-hot-loader to define which modules should be hot reloaded.

Here's a usage example in TypeScript with App being the topmost component in a React component tree:

Copy
import { hot } from "react-hot-loader";

const App: FunctionComponent = () => (
  <div>
    ...
  </div>
);

export default hot(module)(App)
You can use this pattern in any other components depending on what you want to reload. For example, if you use the hot() HOC for an AppBar component and make a change to a child of AppBar, then the entire AppBar gets reloaded, but the higher-level App layout remains otherwise unchanged. In essence, a change will propagate up to the first hot() HOC found in a component tree.

What happens in production?
In theory, you shouldn't need to care. In development, we spin up webpack-dev-server instances to power your renderer processes. In production, we just build the static files.

Assuming you use the defined globals we explained in the above section, everything should work when your app is packaged.

How do I do virtual routing?
If you want to use something like react-router to do virtual routing in your app, you will need to ensure you use a history method that is not based on the browser history APIs. Browser history will work in development but not in production, as your code will be loaded from the filesystem, not a web server. In the react-router case, you should use the MemoryRouter to make everything work.