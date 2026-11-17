import type { SignupInput } from '@/models/auth';

import type { FirebaseAuthSession } from './models/firebaseAuthSession';

export interface FirebaseAuthServiceInterface {

  signIn(email: string, password: string): Promise<FirebaseAuthSession>;

  signUp(input: SignupInput): Promise<FirebaseAuthSession>;

  refresh(session: FirebaseAuthSession): Promise<FirebaseAuthSession>;

}
