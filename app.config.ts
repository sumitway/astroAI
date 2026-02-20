import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Jyotish AI',
  slug: 'jyotish-ai',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#03000F',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jyotishai.app',
    buildNumber: '1',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'We need your location to calculate accurate Panchanga and auspicious times.',
      NSCameraUsageDescription: 'To scan birth certificates for data entry.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#03000F',
    },
    package: 'com.jyotishai.app',
    versionCode: 1,
    permissions: ['ACCESS_FINE_LOCATION', 'CAMERA', 'VIBRATE'],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/icon.png',
    output: 'static',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-location',
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#667EEA',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#03000F',
        image: './assets/images/splash.png',
      },
    ],
  ],
  scheme: 'jyotishai',
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    cognitoUserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
    cognitoClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
    awsRegion: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
});
