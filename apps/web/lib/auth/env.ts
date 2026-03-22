export const appEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Semantic Web Template',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
  enableMockAuth: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== 'false',
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    useEmulator: process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR !== 'false',
    authEmulatorUrl: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL,
  },
  sessionSecret: process.env.SESSION_SECRET ?? 'replace-me',
};
