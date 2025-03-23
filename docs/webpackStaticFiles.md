orientalperil
opened on Mar 29, 2020 · edited by orientalperil
Preflight Checklist

I have read the contribution documentation for this project.

I agree to follow the code of conduct that this project follows, as appropriate.

I have searched the issue tracker for a feature request that matches the one I want to file, without success.
Problem Description
I'm having trouble getting images to load in Electron consistently. I'm using Electron Forge with the webpack template https://www.electronforge.io/templates/webpack-template

My src directory looks like this:

├── images
│   └── black.png
├── index.css
├── index.html
├── index.js
├── main.js
└── renderer.js
My HTML code looks like this:

<img src="images/black.png">
I'm using copy-webpack-plugin to copy the images directory.

When running in development (npm run start) the root of the dev server is .webpack/renderer so the image loads. When running in production (npm run package) the HTML file is being opened from the file system so the image tag is trying to access .webpack/renderer/main_window/images which is the wrong location and it doesn't load.

I've seen the recommendation to import the image into renderer.js but I have a few thousand images. Should I do it like this?

import './images/1.png';
import './images/2.png';
import './images/3.png';
// ...
import './images/1000.png';
Is there a way to programmatically import? Something like:

let imageMap = {};
for (let i of Iter.range(1, 1001)) {
  let image = import(`./images/${i}.png`);
  imageMap[i] = image;
}
Then how would I refer to it in HTML? Can it be done without DOM editing code?

I prefer not to import my images into my JavaScript file and run them through webpack loaders. I just want to reference static files from my HTML code in a way that works in both development and production.

I also have a 5MB JSON file that I need to access using fetch(). I tried to import this through a loader but the build process took more than 5 minutes and I killed it.

Proposed Solution
I can think of a few ways to solve this:

The webpack config needs to know via some kind of environment variable or flag if it is running in development or production and change the copy-webpack-plugin's "to" path.
Change the development server to run so its root is .webpack/renderer/main_window
In production run a server instead of loading from the file system
I was able to implement the last option by running a static Express server in production serving the renderer directory. I use absolute paths (/images/foo.png) for image tags and can access my static files.

webpack.renderer.config.js

const path = require('path');
const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assets = ['data', 'images'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'src', asset),
      to: asset
    }
  ]);
});

module.exports = {
  module: {
    rules: [
      ...rules,
    ],
  },
  plugins: [
    ...copyPlugins,
  ]
};
main.js

import { app, BrowserWindow } from 'electron';
import path from 'path';
import express from 'express';

function isDebug() {
  return process.env.npm_lifecycle_event === 'start';
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 740,
  });

  if (isDebug()) {
    // Create the browser window.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.openDevTools();
  } else {
    const exApp = express();
    exApp.use(express.static(path.resolve(__dirname, '..', 'renderer')));
    const server = exApp.listen(0, () => {
      console.log(`port is ${server.address().port}`);
      mainWindow.loadURL(`http://localhost:${server.address().port}/main_window/`);
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
Additional Information
I've seen a solution expressed in these links but I could not get it to work in both development and production.

#1196

#941

Conclusion
Loading static files is a basic part of making web pages and should be a part of the project template.

Please implement some kind of recommendation or code sample in the docs for static file serving. This is not the first ticket talking about this. People are spending huge amounts of time on it. This is something that should be simple but I've spent hours trying to figure it out.

I know there is an example of importing a CSS file into a JavaScript file but that it a unusable approach when you have thousands of large files to the point that the webpack dev server cannot even boot.

There is not an explanation of why the development system runs from a server and the production one runs from a file other than I suppose that the dev serve gives reloading ability. This mismatch is the root of the problem everyone is having. Running a server in production is the most reasonable way to make these the same.

And I just today saw a new ticket marking this as a bug #1591.

Activity
orientalperil
added 
enhancement
 on Mar 29, 2020
orientalperil
mentioned this on Mar 29, 2020
(Webpack) No dependencies and incorrect paths after packaging #1591
nikitasnv
nikitasnv commented on May 13, 2020
nikitasnv
on May 13, 2020 · edited by nikitasnv
There is a solution if you are not using a server:

webpack.render.config.js
const assets = ['static'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve( __dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }
  ]);
});

module.exports = {
    //...
    plugins: [
        ...copyPlugins 
    ],
};
You need to register own file protocol to handle custom requests for static files. Do it in window creation handler.

main.js
import { app, BrowserWindow, session } from 'electron';
//...
session.defaultSession.protocol.registerFileProtocol('static', (request, callback) => {
        const fileUrl = request.url.replace('static://', '');
        const filePath = path.join(app.getAppPath(), '.webpack/renderer', fileUrl);
        callback(filePath);
    });
Then you can use it in html like this:

 <img alt="" src="static://static/img.png" />
ifdion
ifdion commented on Jul 16, 2020
ifdion
on Jul 16, 2020
Another solution is to just copy the static files inside the renderer to the main_window using the packageAfterExtract hook.

Add cpy package yarn add cpy
Create forge.config.js with the content below or copy the hook if you already have one
const path = require('path');
const cpy = require('cpy');

module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'electron_forge_webpack',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
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
  hooks: {
    packageAfterExtract: async () => {
      console.log('On hook packageAfterExtract');
      await cpy(
        [path.resolve(__dirname, '.webpack/renderer/*.*')],
        path.resolve(__dirname, '.webpack/renderer/main_window')
      );
      console.log('Files copied!');
    },
  },
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
};

malept
added 
plugin/webpack
Issues or pull requests related to first-party webpack plugins/templates
 on Sep 30, 2020
linonetwo
linonetwo commented on Mar 12, 2021
linonetwo
on Mar 12, 2021
I'm doing this:

import fs from 'fs-extra';


      protocol.registerFileProtocol('file', async (request, callback) => {
        const pathname = decodeURIComponent(request.url.replace('file:///', ''));
        if (path.isAbsolute(pathname) ? await fs.pathExists(pathname) : await fs.pathExists(`/${pathname}`)) {
          callback(pathname);
        } else {
          const filePath = path.join(app.getAppPath(), '.webpack/renderer', pathname);
          callback(filePath);
        }
      });
{
    test: /\.(png|jpe?g|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: true,
            },
            optipng: {
              optimizationLevel: 7,
            },
          },
        },
      },
    ],
  }
linonetwo
added a commit that references this issue on Mar 12, 2021
fix: serving static images

bb515c7
linonetwo
linonetwo commented on Mar 21, 2021
linonetwo
on Mar 21, 2021
Oh, seems registerFileProtocol('file' only work during dev time, on production, a relative file require will be handled by election, and registerFileProtocol's callback won't gets called.

mnesarco
mnesarco commented on Apr 3, 2021
mnesarco
on Apr 3, 2021
Hi Friends,
does anyone knows a real simple solution to use a .woff font? I have wasted hours trying all the proposed workarounds without any succes. My project is new, only have created the app and I am trying to setup my icons font, after hous of googling, reading official docs, reading here.... nothing works.

A Simple working example from the project creation would be great.

Thank you very much.

I have create the project with this simple command:

yarn create electron-app XXX --template=typescript-webpack 

This is my relevant css file

@font-face {
    font-family: "icons-f";
    src: url("./icons-f.woff") format("woff");
}

.icon {
    font-family: "icons-f";
    font-size: 32px;
}

Honestly it is useless to provide more code here as i have tested many many many approaches. I think the only real solution is to see a very minimal working example.

Thanks in advance. This is a desperate plea for help. I can't believe such a simple thing is so complicated. I am a very experienced developer and this is driving me nuts.

mnesarco
mnesarco commented on Apr 3, 2021
mnesarco
on Apr 3, 2021
The only thing that finally worked for me was:

// webpack.renderer.config
...
rules.push(
  {
    test: /\.(woff(2)?|ttf)$/, // We will handle of these file extensions
    loader: "url-loader?limit=150000"
  },
);
---
I also changed the woff font for a true type font because the former renders wrong chars in electron but renders the correct ones in chrome. So after many hours wasted I decided for the true type.

Alpha018
Alpha018 commented on May 18, 2021
Alpha018
on May 18, 2021 · edited by Alpha018
@nikitasnv I try use this to solve my problem with the static assets but when i use this with copy-webpack-plugin throw me a error.

webpack.render.config.js
const assets = ['static'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve( __dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }
  ]);
});

module.exports = {
    //...
    plugins: [
        ...copyPlugins 
    ],
};
i replace this for

const assets = ['static'];
const copyPlugins = new CopyWebpackPlugin(
  {
    patterns: assets.map((asset) => ({
      from: path.resolve(__dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }))
  }
);
and this work for me.

Tested on: copy-webpack-plugin@6.4.1

christian-predebon
christian-predebon commented on May 19, 2021
christian-predebon
on May 19, 2021 · edited by christian-predebon
@Alpha018, @nikitasnv's solution work for the app icon too? I mean, I tried to go along with this approach of serving static files but when I set the app icon (or the tray icon) in the main.ts file and I npm started I got an error of type Image could not be created from static://....
My main.ts is as follow:

mainWindow = new BrowserWindow({
  width: 1600,
  height: 862,
  show: false,
  icon: "static://static/app_icon.png",
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true
  }
})
Any ideas?

Alpha018
Alpha018 commented on May 19, 2021
Alpha018
on May 19, 2021 · edited by Alpha018
@kasugaicrow If you need set a app icon you need created a .ico file (for windows) and set the package.json with the path of ico

for example (Electron forge 6):

"config": {
    "forge": {
      "packagerConfig": {
        "icon": "./icon-app.ico"
      },
     ...
    }
}
or (Electron Forge 5)

"config": {
    "forge": {
      "electronPackagerConfig": {
        "icon": "./icon-app.ico"
      },
     ...
    }
}
And run npm run make command to create an .exe (for windows)

Result Example:
image

christian-predebon
christian-predebon commented on May 20, 2021
christian-predebon
on May 20, 2021
@Alpha018 ok that's cool because I actually can set the app icon in the package.json file, but what if I want to set the tray menu icon, that is mandatory in order to create the menu and you can't set it anywhere but the main.ts file. Anyway thank you for your time!

Alpha018
Alpha018 commented on May 21, 2021
Alpha018
on May 21, 2021 · edited by Alpha018
@kasugaicrow depends on the "meker type" you choose, if you use Squirrel.Windows this will install an app inside the system leaving an app on the desktop and in the menu with the icon of your choice.

I will leave you an example of an app compiled with Squirrel.Windows in the menu bar.
image

christian-predebon
christian-predebon commented on May 23, 2021
christian-predebon
on May 23, 2021 · edited by christian-predebon
@Alpha018 I'm not sure I understand your answer, I was talking about the tray menu.

cesarvarela
cesarvarela commented on May 30, 2021
cesarvarela
on May 30, 2021
Why is this not part of the project? Not enough time to do it, or is there an easier way? I'm curious how this project is being used if this feature seems so basic doesn't come out of the box?

For example, I'm creating a new BrowserWindow, and then I want to set the HTML contents.

MarshallOfSound
MarshallOfSound commented on Feb 3, 2022
MarshallOfSound
on Feb 3, 2022
Member
Duplicate of #1431

MarshallOfSound
marked this as a duplicate of Document how to use file-loader correctly for renderer webpack configs #1431 on Feb 3, 2022
MarshallOfSound
closed this as completedon Feb 3, 2022
aryanshridhar
mentioned this on Jun 17, 2022
build(forge): introduce webpack plugin and remove parcel electron/fiddle#1109
SevenZark
SevenZark commented on Feb 20, 2023
SevenZark
on Feb 20, 2023
@nikitasnv I try use this to solve my problem with the static assets but when i use this with copy-webpack-plugin throw me a error.

webpack.render.config.js
const assets = ['static'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve( __dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }
  ]);
});

module.exports = {
    //...
    plugins: [
        ...copyPlugins 
    ],
};
i replace this for

const assets = ['static'];
const copyPlugins = new CopyWebpackPlugin(
  {
    patterns: assets.map((asset) => ({
      from: path.resolve(__dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }))
  }
);
and this work for me.

Tested on: copy-webpack-plugin@6.4.1

Unfortunately, this approach does not work for me. When I try to use this, I get a confusing (for me) console error: "Refused to load the image 'static://trash.png' because it violates the following Content Security Policy directive: "default-src 'self' 'unsafe-inline' data:". Note that 'img-src' was not explicitly set, so 'default-src' is used as a fallback."

@nikitasnv I try use this to solve my problem with the static assets but when i use this with copy-webpack-plugin throw me a error.

webpack.render.config.js
const assets = ['static'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve( __dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }
  ]);
});

module.exports = {
    //...
    plugins: [
        ...copyPlugins 
    ],
};
i replace this for

const assets = ['static'];
const copyPlugins = new CopyWebpackPlugin(
  {
    patterns: assets.map((asset) => ({
      from: path.resolve(__dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }))
  }
);
and this work for me.

Tested on: copy-webpack-plugin@6.4.1

I've tried this copy plugin approach, but I get an error that is very confusing to me: "Refused to load the image 'static://trash.png' because it violates the following Content Security Policy directive: "default-src 'self' 'unsafe-inline' data:". Note that 'img-src' was not explicitly set, so 'default-src' is used as a fallback."

SevenZark
SevenZark commented on Feb 20, 2023
SevenZark
on Feb 20, 2023
Why is this not part of the project? Not enough time to do it, or is there an easier way? I'm curious how this project is being used if this feature seems so basic doesn't come out of the box?

For example, I'm creating a new BrowserWindow, and then I want to set the HTML contents.

It is strange how difficult it is to just show static images. And it's a deal-breaker for me. I've lost several days trying to figure out how to do something like this, and now I will lose even more time learning some new framework. Or, worse, learning to natively for one target and have my app only available for that platform/OS. I'm flabbergasted that Electron is so popular but it can't just show images. Static image technology is many decades old. Bizarre.

maxmandia
maxmandia commented on Mar 10, 2023
maxmandia
on Mar 10, 2023
^ agreed. this is beyond frustrating

erickzhao
erickzhao commented on Mar 11, 2023
erickzhao
on Mar 11, 2023 · edited by erickzhao
Member
👋 Hey @SevenZark @maxmandia

Sorry for the frustration. I spent some time figuring out how to get images to show up in static HTML with webpack 5 and came up with a little repro to help you out.

TL;DR use html-loader
You need to add html-loader to the renderer webpack rules:

erickzhao/ericktron-forge@166d854

From there, I was able to get an image to load in dev and when packaged:

image

Full code: https://github.com/erickzhao/ericktron-forge/tree/html-image-example

Why does this work?
This person on StackOverflow explains it better than me, but the TL;DR is that you want webpack to be aware of static assets (in this case, images) being referenced in your HTML.

The 'proper' way is to let webpack know about your image dependancies by 'requiring' the images. So instead of <img src="./img/my-image.jpg"> in the html, you should write <img src="${require(./img/my-image.jpg)}" />. BUT changing all your images references to the require version is cumbersome, so that's when you use the html-loader, it will do that automatically for you.

https://stackoverflow.com/questions/47996190/how-does-html-webpack-plugin-work-with-html-loader

Why is this so hard/unintuitive?
I'm flabbergasted that Electron is so popular but it can't just show images. Static image technology is many decades old. Bizarre.

At its core, Electron supports static images in HTML just fine. It's the same as writing it for any web browser target. Try it yourself by in Electron Fiddle or by cloning electron/electron-quick-start!

Why doesn't it work out of the box with the webpack plugin? Although webpack has historically been the most stable/configurable bundler option, that also comes with a trade-off: it requires additional configuration for most use-cases, including static HTML.

Forge's webpack plugin provides a layer of abstraction to get Electron compatibility sorted out, but doesn't really provide info around setting up webpack beyond that (and I would argue that anything that isn't Electron-specific should belong in the webpack docs and not ours).

Tracking solutions in this issue is also made more confusing by the webpack 4-> 5 migration. For instance, file-loader, raw-loader, and url-loader were deprecated altogether in webpack 5, being replaced by Asset Modules.

TL;DR:

You need to configure webpack whenever you use it.
Webpack is hard.
Some answers you find online (including in this issue) may be referring to outdated webpack 4 solutions.
acequants
acequants commented on Jun 16, 2023
acequants
on Jun 16, 2023
In 2023 this solution worked for me SIMPLE and STRAIGHT forward

This solution worked for me --------> #1592
Slightly modify the assets part as below basing on your folder structure

assets.map((asset) => { return new CopyWebpackPlugin({ patterns: assets.map((asset) => ({ from: path.resolve(__dirname, "src/assets", asset), to: path.resolve(__dirname, ".webpack/renderer", asset), })), }); });

ltyiz07
ltyiz07 commented on Sep 11, 2024
ltyiz07
on Sep 11, 2024 · edited by ltyiz07
There is a solution if you are not using a server:

webpack.render.config.js
const assets = ['static'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve( __dirname, 'src', asset),
      to: path.resolve(__dirname, '.webpack/renderer', asset)
    }
  ]);
});

module.exports = {
    //...
    plugins: [
        ...copyPlugins 
    ],
};
You need to register own file protocol to handle custom requests for static files. Do it in window creation handler.

main.js
import { app, BrowserWindow, session } from 'electron';
//...
session.defaultSession.protocol.registerFileProtocol('static', (request, callback) => {
        const fileUrl = request.url.replace('static://', '');
        const filePath = path.join(app.getAppPath(), '.webpack/renderer', fileUrl);
        callback(filePath);
    });
Then you can use it in html like this:

 <img alt="" src="static://static/img.png" />
This just works fine for me.
But session.defaultSession.protocol.registerFileProtocol is deprecated so I change that part as protocol.handle as from reference.

For typescript code

  protocol.handle(
    "static",
    (request: GlobalRequest): Promise<GlobalResponse> => {
      const fileUrl = request.url.replace("static://", "");
      const filePath = join(app.getAppPath(), ".webpack/renderer", fileUrl);
      return net.fetch(filePath);
    },
  );