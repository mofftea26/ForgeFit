const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

// Let the transformer handle .svg as React components
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// Treat .svg as source, not an asset
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
