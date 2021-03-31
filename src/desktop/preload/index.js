const { contextBridge } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const unhandled = require('electron-unhandled');
const createStorageEngine = require('redux-persist-electron-storage');

const { receiveActionsFromRenderer, setupIpc } = require('./ipc');

unhandled({
  logger: (error) => console.error(error.stack),
  // tippy.js seems to have a bug with the tooltips we use in the 3D view, and
  // this sometimes throws unhandled exceptions. We don't want these to
  // interfere with the user so we disable the unhandled exception dialog until
  // the bug is fixed in tippy.js
  showDialog: false,
});

/**
 * Creates a Redux state store object that stores the Redux state in an
 * Electron store.
 *
 * @return {Object}  a Redux storage engine that can be used by redux-storage
 */
function createStateStore() {
  return createStorageEngine({
    store: {
      name: 'state',
    },
  });
}

// Inject the bridge functions between the main and the renderer processes.
// These are the only functions that the renderer processes may call to access
// any functionality that requires Node.js -- they are not allowed to use
// Node.js modules themselves
contextBridge.exposeInMainWorld('bridge', {
  createStateStore,
  isElectron: true,
  loadShowFromFile: (filename) => ipc.callMain('loadShowFromFile', filename),
  provideActions: receiveActionsFromRenderer,
  selectLocalShowFileForOpening: () =>
    ipc.callMain('selectLocalShowFileForOpening'),
});

// Set up IPC channels that we are going to listen to
setupIpc();
