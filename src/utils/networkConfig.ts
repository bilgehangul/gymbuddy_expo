import { Platform } from 'react-native';

/**
 * Network configuration for different environments and platforms
 */
export const getApiBaseUrl = (): string => {
  // Production URL
  if (!__DEV__) {
    return 'https://your-production-api.com';
  }

  // Development URLs - use your computer's IP for Expo Go
  const COMPUTER_IP = '192.168.235.186';
  const PORT = '3000';

  // For Expo Go (physical device or Expo Go app)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Default to computer IP for best compatibility
  return `http://${COMPUTER_IP}:${PORT}`;
};

/**
 * Test different connection URLs in order of preference
 */
export const getTestUrls = (): string[] => {
  const COMPUTER_IP = '192.168.235.186';
  const PORT = '3000';

  return [
    `http://${COMPUTER_IP}:${PORT}/health`,
    `http://localhost:${PORT}/health`,
    `http://10.0.2.2:${PORT}/health`, // Android emulator
    `http://127.0.0.1:${PORT}/health`,
  ];
};

/**
 * Platform-specific connection tips
 */
export const getConnectionTips = (): string => {
  return `
Connection Tips:
• Make sure backend server is running
• For physical device: Use computer's IP (${getApiBaseUrl()})
• For iOS Simulator: http://localhost:3000 might work
• For Android Emulator: http://10.0.2.2:3000 might work
• Check Windows Firewall settings
• Ensure both devices are on same WiFi network
  `.trim();
};