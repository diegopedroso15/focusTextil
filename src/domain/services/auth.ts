export interface IAuthService {
  signIn: (input: AuthServiceDTO.SignInInput) => Promise<AuthServiceDTO.SignInOutput>
  signUp: (input: AuthServiceDTO.SignUpInput) => Promise<void>
}

export namespace AuthServiceDTO {
  export type SignInInput = {
    email: string
    password: string
  }

  export type SignInOutput = {
    id: string
    name: string
    email: string
    jwt: string
  }

  export type SignUpInput = {
    name: string
    email: string
    password: string
  }
}
