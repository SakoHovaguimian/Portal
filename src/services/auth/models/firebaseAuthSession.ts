export interface FirebaseAuthSession {
  id_token: string
  refresh_token: string
  expires_at: number
  external_id: string
  email: string
}

export interface FirebaseSignUpInput {
  email: string
  password: string
}
