
function isElectron() {
  // Check if the process is running in Electron
  try {
    require("@sentry/electron/main");
    return true;
  } catch (error) {
    return false;
  }
}

function captureException(error) {
  if (!isElectron()) {
    return;
  }
  const {captureException } = require("@sentry/electron/main");
  if (typeof captureException === "function") {
    captureException(error);
  }
}
function captureMessage(message) {
  if (! isElectron()) {
    return;
  }
  const {captureMessage } = require("@sentry/electron/main");
  if (typeof captureMessage === "function") {
    captureMessage(message);
  }
}
module.exports = {
  captureException,
  captureMessage
};
