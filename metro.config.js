const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable TurboModules for problematic packages
config.resolver.disableHierarchicalLookup = false;
config.resolver.useWatchman = false;

module.exports = config;