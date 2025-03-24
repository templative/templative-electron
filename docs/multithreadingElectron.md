# Multithreading

With [Web Workers][web-workers], it is possible to run JavaScript in OS-level
threads.

## Multi-threaded Node.js

It is possible to use Node.js features in Electron's Web Workers, to do
so the `nodeIntegrationInWorker` option should be set to `true` in
`webPreferences`.

```js
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegrationInWorker: true
  }
})
```

The `nodeIntegrationInWorker` can be used independent of `nodeIntegration`, but
`sandbox` must not be set to `true`.

**Note:** This option is not available in [`SharedWorker`s](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) or [`Service Worker`s](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) owing to incompatibilities in sandboxing policies.

## Available APIs

All built-in modules of Node.js are supported in Web Workers, and `asar`
archives can still be read with Node.js APIs. However none of Electron's
built-in modules can be used in a multi-threaded environment.

## Native Node.js modules

Any native Node.js module can be loaded directly in Web Workers, but it is
strongly recommended not to do so. Most existing native modules have been
written assuming single-threaded environment, using them in Web Workers will
lead to crashes and memory corruptions.

Note that even if a native Node.js module is thread-safe it's still not safe to
load it in a Web Worker because the `process.dlopen` function is not thread
safe.

The only way to load a native module safely for now, is to make sure the app
loads no native modules after the Web Workers get started.

```js
process.dlopen = () => {
  throw new Error('Load native module is not safe')
}
const worker = new Worker('script.js')
```

[web-workers]: https://developer.mozilla.org/en/docs/Web/API/Web_Workers_API/Using_web_workers


## Don't block the main process
Electron's main process (sometimes called "browser process") is special: It is the parent process to all your app's other processes and the primary process the operating system interacts with. It handles windows, interactions, and the communication between various components inside your app. It also houses the UI thread.

Under no circumstances should you block this process and the UI thread with long-running operations. Blocking the UI thread means that your entire app will freeze until the main process is ready to continue processing.

Why?
The main process and its UI thread are essentially the control tower for major operations inside your app. When the operating system tells your app about a mouse click, it'll go through the main process before it reaches your window. If your window is rendering a buttery-smooth animation, it'll need to talk to the GPU process about that – once again going through the main process.

Electron and Chromium are careful to put heavy disk I/O and CPU-bound operations onto new threads to avoid blocking the UI thread. You should do the same.

How?
Electron's powerful multi-process architecture stands ready to assist you with your long-running tasks, but also includes a small number of performance traps.

For long running CPU-heavy tasks, make use of worker threads, consider moving them to the BrowserWindow, or (as a last resort) spawn a dedicated process.

Avoid using the synchronous IPC and the @electron/remote module as much as possible. While there are legitimate use cases, it is far too easy to unknowingly block the UI thread.

Avoid using blocking I/O operations in the main process. In short, whenever core Node.js modules (like fs or child_process) offer a synchronous or an asynchronous version, you should prefer the asynchronous and non-blocking variant.

## Don't block the renderer process
Since Electron ships with a current version of Chrome, you can make use of the latest and greatest features the Web Platform offers to defer or offload heavy operations in a way that keeps your app smooth and responsive.

Why?
Your app probably has a lot of JavaScript to run in the renderer process. The trick is to execute operations as quickly as possible without taking away resources needed to keep scrolling smooth, respond to user input, or animations at 60fps.

Orchestrating the flow of operations in your renderer's code is particularly useful if users complain about your app sometimes "stuttering".

How?
Generally speaking, all advice for building performant web apps for modern browsers apply to Electron's renderers, too. The two primary tools at your disposal are currently requestIdleCallback() for small operations and Web Workers for long-running operations.

requestIdleCallback() allows developers to queue up a function to be executed as soon as the process is entering an idle period. It enables you to perform low-priority or background work without impacting the user experience. For more information about how to use it, check out its documentation on MDN.

Web Workers are a powerful tool to run code on a separate thread. There are some caveats to consider – consult Electron's multithreading documentation and the MDN documentation for Web Workers. They're an ideal solution for any operation that requires a lot of CPU power for an extended period of time.