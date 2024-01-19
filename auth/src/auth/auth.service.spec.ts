import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LoginUserInput } from './dto/login-user-input';
import { LoginUserResponse } from './entities/login-user-response';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const prismaServiceMock = {
    user: {
      findFirst: jest.fn(),
    },
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return accessToken for valid user', async () => {
      const loginUserInput: LoginUserInput = {
        username: 'test@gmail.com',
        password: 'test123456',
      };

      const user = {
        id: 1,
        userEmail: {
          email: 'test@gmail.com',
        },
        userMobile: {
          mobile: '1234567890',
        },
        password:
          '$2b$10$Ffir04p/umxgx7vXd3AA9.cn3uPnt3gRQuo6qekL8ZPwuIIYYENP6',
        role: {
          name: 'user',
        },
      };

      const loginUserResponse: LoginUserResponse = {
        userId: 1,
        accessToken: 'random',
        expiresInDays: 15,
        role: 'user',
        onBoardingCompleted: undefined,
        signInByGoogle: undefined,
      };

      prismaServiceMock.user.findFirst.mockResolvedValue(user);
      jwtServiceMock.sign.mockReturnValue('random');

      const result = await authService.login(loginUserInput);
      expect(result).toEqual(loginUserResponse);
    });

    it('should deny for invalid user', async () => {
      const loginUserInput: LoginUserInput = {
        username: 'test@gmail.com',
        password: 'test',
      };

      const user = {
        id: 1,
        userEmail: {
          email: 'testing@gmail.com',
        },
        userMobile: {
          mobile: '1234567890',
        },
        password: 'test',
        role: {
          name: 'user',
        },
      };

      prismaServiceMock.user.findFirst.mockResolvedValue(user);
      await expect(authService.login(loginUserInput)).rejects.toThrow();
    });

    it('should deny if user doesnot exists', async () => {
      const loginUserInput: LoginUserInput = {
        username: 'test@gmail.com',
        password: 'test',
      };

      prismaServiceMock.user.findFirst.mockResolvedValue(undefined);
      await expect(authService.login(loginUserInput)).rejects.toThrow();
    });

    it('should return accessToken for phone number', async () => {
      const loginUserInput: LoginUserInput = {
        username: '1234567890',
        password: 'test123456',
      };

      const user = {
        id: 1,
        userEmail: {
          email: 'test@gmail.com',
        },
        userMobile: {
          mobile: '1234567890',
        },
        password:
          '$2b$10$Ffir04p/umxgx7vXd3AA9.cn3uPnt3gRQuo6qekL8ZPwuIIYYENP6',
        role: {
          name: 'user',
        },
      };

      const loginUserResponse: LoginUserResponse = {
        userId: 1,
        accessToken: 'random',
        expiresInDays: 15,
        role: 'user',
        onBoardingCompleted: undefined,
        signInByGoogle: undefined,
      };

      prismaServiceMock.user.findFirst.mockResolvedValue(user);
      jwtServiceMock.sign.mockReturnValue('random');
      const result = await authService.login(loginUserInput);
      expect(result).toEqual(loginUserResponse);
    });
  });
});
