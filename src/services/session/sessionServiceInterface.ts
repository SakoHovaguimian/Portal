import type { FirebaseAuthSession } from '../auth/models/firebaseAuthSession'

export interface SessionServiceInterface {
  createSession(session: FirebaseAuthSession): Promise<void>
  deleteSession(): Promise<void>
  getSession(): Promise<FirebaseAuthSession | null>
  getValidSession(): Promise<FirebaseAuthSession | null>
}
