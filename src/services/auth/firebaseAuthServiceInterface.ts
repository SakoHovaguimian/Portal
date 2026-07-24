import type { FirebaseAuthSession, FirebaseSignUpInput } from './models/firebaseAuthSession'

export interface FirebaseAuthServiceInterface {
  signIn(email: string, password: string): Promise<FirebaseAuthSession>
  signUp(input: FirebaseSignUpInput): Promise<FirebaseAuthSession>
  refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession>
  deleteUser(idToken: string): Promise<void>
  sendPasswordResetEmail(email: string): Promise<void>
}
