module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 4 delegates to worklets — use worklets plugin directly (must be last).
    plugins: ['react-native-worklets/plugin'],
  };
};
