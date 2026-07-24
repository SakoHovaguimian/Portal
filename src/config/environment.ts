import 'server-only'

export type AuthMode = 'none' | 'firebase' | 'custom'
export type RealtimeMode = 'none' | 'socketio'

function getRequiredEnvironmentValue(name: string): string {

  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value

}

function getFirstEnvironmentValue(names: string[]): string {

  for (const name of names) {
    const value = process.env[name]?.trim()

    if (value) {
      return value
    }
  }

  throw new Error(`Missing required environment variable: ${names.join(' or ')}`)

}

export const ServerEnvironment = {
  get authMode(): AuthMode {
    const value = process.env.PORTAL_AUTH_MODE?.trim().toLowerCase() || 'none'

    if (value === 'none' || value === 'firebase' || value === 'custom') {
      return value
    }

    throw new Error(`Unsupported PORTAL_AUTH_MODE: ${value}`)
  },
  get realtimeMode(): RealtimeMode {
    const value = process.env.PORTAL_REALTIME_MODE?.trim().toLowerCase() || 'none'

    if (value === 'none' || value === 'socketio') {
      return value
    }

    throw new Error(`Unsupported PORTAL_REALTIME_MODE: ${value}`)
  },
  get apiBaseUrl(): string {
    return (process.env.PORTAL_API_URL?.trim() || 'http://localhost:3000').replace(/\/$/, '')
  },
  get appVersion(): string {
    return process.env.PORTAL_APP_VERSION?.trim() || '1.0.0'
  },
  get firebaseWebApiKey(): string {
    return getFirstEnvironmentValue(['FIREBASE_API_KEY', 'FIREBASE_WEB_API_KEY'])
  },
  get firebaseAuthDomain(): string {
    return getRequiredEnvironmentValue('FIREBASE_AUTH_DOMAIN')
  },
  get firebaseProjectId(): string {
    return getRequiredEnvironmentValue('FIREBASE_PROJECT_ID')
  },
  get firebaseStorageBucket(): string {
    return getRequiredEnvironmentValue('FIREBASE_STORAGE_BUCKET')
  },
  get firebaseMessagingSenderId(): string {
    return getRequiredEnvironmentValue('FIREBASE_MESSAGE_SENDER_ID')
  },
  get firebaseAppId(): string {
    return getRequiredEnvironmentValue('FIREBASE_APP_ID')
  },
  get socketUrl(): string {
    return (process.env.PORTAL_SOCKET_URL?.trim() || this.apiBaseUrl).replace(/\/$/, '')
  },
  get sessionSecret(): string {

    const secret = getRequiredEnvironmentValue('SESSION_SECRET')

    if (secret.length < 32) {
      throw new Error('SESSION_SECRET must contain at least 32 characters')
    }

    return secret

  },
} as const
