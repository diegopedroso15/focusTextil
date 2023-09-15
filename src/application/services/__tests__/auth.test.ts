import { AuthService } from '../auth';
import { IUserRepository } from '../../../domain/repositories/user';
import { IHasher } from '../../contracts/hasher';
import { IJwt } from '../../contracts/jwt';
import { ISessionManager } from '../../contracts/session-getter';
import { IUuidGenerator } from '../../contracts/uuid-generator';
import { IValidation } from '../../validation/leaves/contract';
import { ApplicationError } from '../../../domain/errors/application';

const mockUserRepository: IUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

const mockUuidGenerator: IUuidGenerator = {
  generate: jest.fn(),
};

const mockHasher: IHasher = {
  compare: jest.fn(),
  encrypt: jest.fn(),
};

const mockJwt: IJwt = {
  generate: jest.fn(),
  verify: jest.fn(),
};

const mockSessionManager: ISessionManager = {
    get: jest.fn(),
    set: jest.fn(),
};

const mockUserValidation: IValidation = {
    validate: jest.fn(),
  };
  describe('AuthService', () => {
    let authService: AuthService;
  
    beforeEach(() => {
      authService = new AuthService(
        mockUserRepository,
        mockUuidGenerator,
        mockHasher,
        mockJwt,
        mockUserValidation,
        mockSessionManager
      );
    });
  
    describe('signIn', () => {
      it('deve autenticar um usuário válido', async () => {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedPassword',
        };
  
        jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(mockUser);
  
        const spyOnHasherCompare = jest.spyOn(mockHasher, 'compare');
        spyOnHasherCompare.mockReturnValue(true);
  
        const spyOnJwtGenerate = jest.spyOn(mockJwt, 'generate');
        spyOnJwtGenerate.mockReturnValue('fakeToken');
  
        const input = {
          email: 'test@example.com',
          password: 'password',
        };
  
        const result = await authService.signIn(input);
  
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockHasher.compare).toHaveBeenCalledWith('password', 'hashedPassword');
        expect(mockJwt.generate).toHaveBeenCalledWith(
          {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
          '1d'
        );
  
        expect(result).toEqual({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          jwt: 'fakeToken',
        });
      });
  
      it('deve lançar uma exceção ApplicationError se o usuário não for encontrado', async () => {
        jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null);
  
        const input = {
          email: 'nonexistent@example.com',
          password: 'password',
        };
  
        try {
          await authService.signIn(input);
        } catch (error: any) {
            console.log(error);
          expect(error).toBeInstanceOf(ApplicationError);
          expect(error.message).toBe('Usuário/senha incorretos');
          expect(error.code).toBe(400);
        }
      });
  

      it('deve lançar uma exceção ApplicationError se a senha for inválida', async () => {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedPassword',
        };
  
        jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(mockUser);
  
        const spyOnHasherCompare = jest.spyOn(mockHasher, 'compare');
        spyOnHasherCompare.mockReturnValue(false); 
  
        const input = {
          email: 'test@example.com',
          password: 'invalidPassword',
        };
  
        try {
          await authService.signIn(input);
          fail('Expected ApplicationError to be thrown');
        } catch (error: any) {
          expect(error).toBeInstanceOf(ApplicationError);
          expect(error.message).toBe('Usuário/senha incorretos');
          expect(error.code).toBe(400);
        }
      });
    });
  });
  
