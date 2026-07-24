export interface AuthActionState {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export const InitialAuthActionState: AuthActionState = {
  status: 'idle',
}
