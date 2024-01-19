import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { getQueueToken } from '@nestjs/bull';
import { CreateUserInput } from './dto/create-user.input';
import { RoleService } from '../../src/role/role.service';
import { AccountStatus } from '@prisma/client';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { CreateUserDetails } from './dto/create-user-details.input';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let roleService: RoleService;

  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    userEmail: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    userMobile: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    userDetail: {
      create: jest.fn(),
    },
    studyLevel: {
      findFirst: jest.fn(),
    },
    institution: {
      findFirst: jest.fn(),
    },
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const roleServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getQueueToken('user'),
          useValue: mockQueue,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    roleService = module.get<RoleService>(RoleService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and send verification code in email', async () => {
      const createUserInput: CreateUserInput = {
        roleId: 2,
        firstName: 'Test',
        lastName: 'User',
        email: 'user@test.com',
        password: 'user@123',
      };

      const expectedResult = {
        id: 1,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        onBoardingCompleted: false,
        signInByGoogle: false,
        accountStatus: AccountStatus.trial,
        role: {
          id: 2,
          name: 'Test',
        },
        userEmail: {
          email: 'user@test.com',
          verificationCode: 123456,
          verifiedAt: null,
        },
      };

      prismaServiceMock.user.create.mockResolvedValue(expectedResult);

      const result = await service.create(createUserInput);

      expect(result).toEqual(expectedResult);
      expect(roleService.findOne).toHaveBeenCalledWith(createUserInput.roleId);
      expect(prismaService.userEmail.findUnique).toHaveBeenCalledWith({
        where: { email: createUserInput.email },
      });
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw error if email has already been taken', async () => {
      const createUserInput: CreateUserInput = {
        roleId: 2,
        firstName: 'Test',
        lastName: 'User',
        email: 'user@test.com',
        password: 'user@123',
      };

      prismaServiceMock.userEmail.findUnique.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        email: 'user@test.com',
      });

      await expect(service.create(createUserInput)).rejects.toThrow();
    });
  });

  describe('createUserDetails', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should create a new user details', async () => {
      const createUserDetail: CreateUserDetails = {
        userId: 1,
        studyLevelId: 1,
        institutionId: 1,
        academicsType: 'semester',
      };

      const expectedResult = {
        id: 1,
        userId: 1,
        studyLevelId: 1,
        institutionId: 1,
        academicsType: 'semester',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce({
        id: 1,
      });

      prismaServiceMock.institution.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      prismaServiceMock.userDetail.create.mockResolvedValueOnce(expectedResult);
      const result = await service.createUserDetails(createUserDetail);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if study level does not exist', async () => {
      const createUserDetail: CreateUserDetails = {
        userId: 1,
        studyLevelId: 1,
        institutionId: 1,
        academicsType: 'semester',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce(undefined);

      prismaServiceMock.institution.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      prismaServiceMock.userDetail.create.mockResolvedValueOnce(undefined);
      await expect(
        service.createUserDetails(createUserDetail),
      ).rejects.toThrow();
    });

    it('should throw error if institution does not exist', async () => {
      const createUserDetail: CreateUserDetails = {
        userId: 1,
        studyLevelId: 1,
        institutionId: 1,
        academicsType: 'semester',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });

      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce({
        id: 1,
      });

      prismaServiceMock.institution.findFirst.mockResolvedValueOnce(undefined);

      prismaServiceMock.userDetail.create.mockResolvedValueOnce(undefined);
      await expect(
        service.createUserDetails(createUserDetail),
      ).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should return all users and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const expectedResult = [
        {
          id: 1,
          firstName: 'Test',
          middleName: null,
          lastName: 'User',
          onBoardingCompleted: false,
          signInByGoogle: false,
          accountStatus: AccountStatus.trial,
          role: {
            id: 2,
            name: 'Test',
          },
          userEmail: {
            email: 'user@test.com',
            verificationCode: 123456,
            verifiedAt: null,
          },
        },
      ];

      prismaServiceMock.user.count.mockResolvedValueOnce(1);
      prismaServiceMock.user.findMany.mockResolvedValueOnce(expectedResult);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        users: expectedResult,
      });
    });

    it('should return specific data based on search parameters', async () => {
      const query: CommonQuery = {
        search: 'Test',
      };

      prismaServiceMock.user.count.mockResolvedValueOnce(1);
      prismaServiceMock.user.findMany.mockResolvedValueOnce([
        {
          id: 1,
          firstName: 'Test',
        },
      ]);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        users: [
          {
            id: 1,
            firstName: 'Test',
          },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return the user if exists', async () => {
      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        onBoardingCompleted: false,
        signInByGoogle: false,
        accountStatus: AccountStatus.trial,
        role: {
          id: 2,
          name: 'Test',
        },
        userEmail: {
          email: 'user@test.com',
          verificationCode: 123456,
          verifiedAt: null,
        },
      });

      prismaServiceMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        onBoardingCompleted: false,
        signInByGoogle: false,
        accountStatus: AccountStatus.trial,
        role: {
          id: 2,
          name: 'Test',
        },
        userEmail: {
          email: 'user@test.com',
          verificationCode: 123456,
          verifiedAt: null,
        },
      });
      
      const result = await service.findOne(1);

      expect(result).toEqual({
        id: 1,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        onBoardingCompleted: false,
        signInByGoogle: false,
        accountStatus: AccountStatus.trial,
        role: {
          id: 2,
          name: 'Test',
        },
        userEmail: {
          email: 'user@test.com',
          verificationCode: 123456,
          verifiedAt: null,
        },
      });
    });

    it('should throw error if user does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update the existing user', async () => {
      const updateUserInput = {
        id: 2,
        firstName: 'Testing',
        lastName: 'User',
        password: 'user@456',
        email: 'test@gmail.com',
        mobile: '9862329593',
      };

      const expectedResult = {
        id: 2,
        firstName: 'Testing',
        middleName: null,
        lastName: 'User',
        email: 'test@gmail.com',
        mobile: '9862329593',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 2,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        email: 'test@gmail.com',
      });
      prismaServiceMock.userEmail.findFirst.mockResolvedValueOnce(null);
      prismaServiceMock.userMobile.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 2,
        mobile: '9862329593',
      });
      prismaServiceMock.user.update.mockResolvedValueOnce(expectedResult);
      const user: JwtPayload = {
        userId: 2,
        role: Roles.SuperAdmin,
      };
      const result = await service.update(2, updateUserInput, user);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if email has already been taken', async () => {
      const updateUserInput = {
        id: 2,
        firstName: 'Testing',
        middleName: 'bet',
        lastName: 'User',
        password: 'user@456',
        email: 'test@gmail.com',
        mobile: '9862329593',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 2,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
      });
      prismaServiceMock.userEmail.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        email: 'test@gmail.com',
      });
      prismaServiceMock.userMobile.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        mobile: '9862329592',
      });
      const user: JwtPayload = {
        userId: 2,
        role: Roles.SuperAdmin,
      };
      prismaServiceMock.user.update.mockResolvedValueOnce(undefined);
      await expect(service.update(2, updateUserInput, user)).rejects.toThrow();
    });
  });

  describe('updateMobileNumber', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update the existing mobile number', async () => {
      const updateMobileNumberInput = {
        userId: 1,
        mobile: '9862329593',
      };

      const expectedResult = {
        id: 1,
        userId: 1,
        mobile: '9862329593',
        verifiedAt: null,
        verificationCode: 123456,
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });

      prismaServiceMock.userMobile.findUnique.mockResolvedValueOnce(undefined);
      prismaServiceMock.userMobile.update.mockResolvedValueOnce(expectedResult);
      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };
      const result = await service.updateMobileNumber(
        updateMobileNumberInput,
        user,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if mobile number already exists when update', async () => {
      const updateMobileNumberInput = {
        userId: 2,
        mobile: '9862329593',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 2,
      });

      prismaServiceMock.userMobile.findUnique.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        mobile: '9862329593',
      });
      prismaServiceMock.userMobile.update.mockResolvedValueOnce(undefined);
      const user: JwtPayload = {
        userId: 2,
        role: Roles.SuperAdmin,
      };
      await expect(
        service.updateMobileNumber(updateMobileNumberInput, user),
      ).rejects.toThrow();
    });

    it('should throw error if user is not allowed to perform', async () => {
      const updateMobileNumberInput = {
        userId: 2,
        mobile: '9862329593',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });

      prismaServiceMock.userMobile.findUnique.mockResolvedValueOnce({
        id: 2,
        userId: 2,
        mobile: '9862329593',
      });
      prismaServiceMock.userMobile.update.mockResolvedValueOnce(undefined);
      const user: JwtPayload = {
        userId: 1,
        role: Roles.Student,
      };
      await expect(
        service.updateMobileNumber(updateMobileNumberInput, user),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete the existing user', async () => {
      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      const user: JwtPayload = {
        userId: 2,
        role: Roles.SuperAdmin,
      };

      await service.remove(1, user);
      expect(prismaServiceMock.user.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyEmail', () => {
    it('should verify the email address', async () => {
      const verifyEmailInput = {
        email: 'user@test.com',
        verificationCode: '123456',
      };

      const expectedResult = {
        id: 1,
        email: 'user@test.com',
        verifiedAt: new Date(),
        verificationCode: null,
      };

      prismaServiceMock.userEmail.findFirst.mockResolvedValueOnce(
        verifyEmailInput,
      );
      prismaServiceMock.userEmail.update.mockResolvedValueOnce(expectedResult);

      const result = await service.verifyEmail(verifyEmailInput);

      expect(result).toEqual(expectedResult);
    });

    it('should throw error if email address or OTP does not match', async () => {
      const verifyEmailInput = {
        email: 'user@test.com',
        verificationCode: '123456',
      };

      prismaServiceMock.userEmail.findFirst.mockResolvedValueOnce(undefined);

      await expect(service.verifyEmail(verifyEmailInput)).rejects.toThrow();
    });
  });

  describe('addMobileNumber', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should add the mobile number', async () => {
      const addMobileNumberInput = {
        userId: 1,
        mobile: '9862329593',
      };

      const expectedResult = {
        id: 1,
        userId: 1,
        mobile: '9862329593',
      };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 1,
      });
      prismaServiceMock.userMobile.findUnique.mockResolvedValueOnce(undefined);
      prismaServiceMock.userMobile.create.mockResolvedValueOnce(expectedResult);

      const result = await service.addMobileNumber(addMobileNumberInput);

      expect(result).toEqual(expectedResult);
    });

    it('should throw error if mobile number already exists', async () => {
      const addMobileNumberInput = {
        userId: 5,
        mobile: '9842822601',
      };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce({
        id: 6,
      });
      prismaServiceMock.userMobile.findUnique.mockResolvedValueOnce({
        id: 6,
        userId: 5,
        mobile: '9842822601',
      });
      await expect(
        service.addMobileNumber(addMobileNumberInput),
      ).rejects.toThrow();
    });
  });

  describe('verifyMobileNumber', () => {
    it('should verify the mobile number', async () => {
      const verifyMobileNumberInput = {
        mobile: '9862329593',
        verificationCode: '123456',
      };

      const expectedResult = {
        id: 1,
        userId: 1,
        mobile: '9862329593',
        verifiedAt: null,
        verificationCode: 123456,
      };

      prismaServiceMock.userMobile.findFirst.mockResolvedValueOnce(
        verifyMobileNumberInput,
      );
      prismaServiceMock.userMobile.update.mockResolvedValueOnce(expectedResult);

      const result = await service.verifyMobileNumber(verifyMobileNumberInput);

      expect(result).toEqual(expectedResult);
    });

    it('should throw error if mobile number or OTP does not match', async () => {
      const verifyMobileNumber = {
        mobile: '9862329593',
        verificationCode: '123456',
      };

      prismaServiceMock.userMobile.findFirst.mockResolvedValueOnce(undefined);

      await expect(
        service.verifyMobileNumber(verifyMobileNumber),
      ).rejects.toThrow();
    });
  });
});
