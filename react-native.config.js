module.exports = {
  dependencies: {
    // The client flow has no photo editor. Keep its legacy native toolchains out of this app.
    '@baronha/react-native-multiple-image-picker': {
      platforms: { android: null, ios: null },
    },
    'react-native-nitro-modules': {
      platforms: { android: null, ios: null },
    },
  },
};
