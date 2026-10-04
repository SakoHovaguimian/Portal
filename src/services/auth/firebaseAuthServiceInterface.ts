import type { FirebaseAuthSession } from './models/firebaseAuthSession';
import type { SignupInput } from '@/models/auth';
export interface FirebaseAuthServiceInterface {
  signIn(email: string, password: string): Promise<FirebaseAuthSession>;
  signUp(input: SignupInput): Promise<FirebaseAuthSession>;
  refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession>;
}
