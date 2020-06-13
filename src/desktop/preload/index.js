const unhandled = require('electron-unhandled');
const createStorageEngine = require('redux-persist-electron-storage');

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

window.bridge = {
  createStateStore,
};
