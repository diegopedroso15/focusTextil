import 'reflect-metadata';
import { injectable, inject } from 'inversify'
import { User } from '../../domain/entities/user'
import { ApplicationError } from '../../domain/errors/application'
import { IUserRepository } from '../../domain/repositories/user'
import { AuthServiceDTO, IAuthService } from '../../domain/services/auth'
import { IHasher } from '../contracts/hasher'
import { IJwt } from '../contracts/jwt'
import { ISessionManager } from '../contracts/session-getter'
import { IUuidGenerator } from '../contracts/uuid-generator'
import { IValidation } from '../validation/leaves/contract'

@injectable()
export class AuthService implements IAuthService {
  constructor (
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('UuidGenerator') private readonly uuidGenerator: IUuidGenerator,
    @inject('Hasher') private readonly hasher: IHasher,
    @inject('Jwt') private readonly jwt: IJwt,
    @inject('UserValidation') private readonly userValidation: IValidation,
    @inject('SessionManager') private readonly sessionManager: ISessionManager
  ) { }

  async signIn (input: AuthServiceDTO.SignInInput): Promise<AuthServiceDTO.SignInOutput> {
    this.userValidation.validate(input)

    const user = await this.userRepository.findByEmail(input.email)

    if (!user) throw new ApplicationError('Usuário/senha incorretos', 400)

    const validPassword = this.hasher.compare(input.password, user.password)
    if (!validPassword) throw new ApplicationError('Usuário/senha incorretos', 400)

    const { password, ...tokenData } = user
    const token = this.jwt.generate(tokenData, '1d')

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      jwt: token
    }
  }

  async signUp (input: AuthServiceDTO.SignUpInput): Promise<void> {
    this.userValidation.validate(input)

    const exists = await this.userRepository.findByEmail(input.email)

    if (exists) throw new ApplicationError('Usuário já cadastrado', 400)

    const user = new User()

    user.id = this.uuidGenerator.generate()
    user.name = input.name
    user.email = input.email
    user.password = this.hasher.encrypt(input.password)

    await this.userRepository.save(user)
  }
}
