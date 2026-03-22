'use client';

import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { appEnv } from './env';

let emulatorConnected = false;

export function getFirebaseAuth() {
  if (!appEnv.firebase.apiKey || !appEnv.firebase.projectId || appEnv.enableMockAuth) {
    return null;
  }

  const app = getApps()[0]
    ? getApps()[0]
    : initializeApp({
        apiKey: appEnv.firebase.apiKey,
        authDomain: appEnv.firebase.authDomain,
        projectId: appEnv.firebase.projectId,
        storageBucket: appEnv.firebase.storageBucket,
        messagingSenderId: appEnv.firebase.messagingSenderId,
        appId: appEnv.firebase.appId,
      });

  const auth = getAuth(app);

  if (appEnv.firebase.useEmulator && appEnv.firebase.authEmulatorUrl && !emulatorConnected) {
    connectAuthEmulator(auth, appEnv.firebase.authEmulatorUrl, { disableWarnings: true });
    emulatorConnected = true;
  }

  return auth;
}
