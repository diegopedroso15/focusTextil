import { Container, decorate, injectable } from 'inversify'
import { Controller } from 'tsoa'
import { IHasher } from '../application/contracts/hasher'
import { IHttpClient } from '../application/contracts/http-client'
import { IJwt } from '../application/contracts/jwt'
import { ISessionManager } from '../application/contracts/session-getter'
import { IStorage } from '../application/contracts/storage'
import { IUuidGenerator } from '../application/contracts/uuid-generator'
import { AuthService } from '../application/services/auth'
import { IValidation } from '../application/validation/leaves/contract'
import { UserValidation } from '../application/validation/user'
import { IUserRepository } from '../domain/repositories/user'
import { IAuthService } from '../domain/services/auth'
import { Hasher } from '../infra/cryptograph/hasher'
import { AxiosHttpClient } from '../infra/http/axios'
import { UserRepository } from '../infra/repositories/user'
import { Jwt } from '../infra/security/jwt'
import { SessionManager } from '../infra/security/session-getter'
import { Store } from '../infra/storage/store'
import { UuidGenerator } from '../infra/utils/id-generator'
import { AuthController } from './controllers/auth'
const iocContainer = new Container({ defaultScope: 'Singleton' })

iocContainer.bind<IAuthService>('AuthService').to(AuthService)
iocContainer.bind<IUserRepository>('UserRepository').to(UserRepository)
iocContainer.bind<IUuidGenerator>('UuidGenerator').to(UuidGenerator)
iocContainer.bind<ISessionManager>('SessionManager').to(SessionManager)
iocContainer.bind<IHasher>('Hasher').to(Hasher)
iocContainer.bind<IJwt>('Jwt').to(Jwt)
iocContainer.bind<IStorage>('Storage').to(Store)
iocContainer.bind<IValidation>('UserValidation').to(UserValidation)
iocContainer.bind<IHttpClient>('HttpClient').to(AxiosHttpClient)
iocContainer.bind(AuthController).toSelf()

decorate(injectable(), Controller)

export { iocContainer }
