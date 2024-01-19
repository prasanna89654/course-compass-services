import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionService } from './institution.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

describe('InstitutionService', () => {
  let service: InstitutionService;
  let prismaService: PrismaService;

  const prismaServiceMock = {
    institution: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userDetail: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();
    service = module.get<InstitutionService>(InstitutionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new study level', async () => {
      const createInstitutionInput = {
        name: 'NewInstitution',
      };

      const expectedResult = {
        id: 1,
        name: 'NewInstitution',
      };

      prismaServiceMock.institution.create.mockResolvedValueOnce(
        expectedResult,
      );

      const result = await service.create(createInstitutionInput);

      expect(result).toEqual(expectedResult);
      expect(prismaService.institution.create).toHaveBeenCalledWith({
        data: createInstitutionInput,
      });
    });

    it('should throw error if a study level already exists', async () => {
      const createInstitutionInput = {
        name: 'NewInstitution',
      };

      const existingRole = {
        id: 1,
        name: 'NewInstitution',
      };

      prismaServiceMock.institution.findFirst.mockResolvedValueOnce(
        existingRole,
      );

      await expect(service.create(createInstitutionInput)).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should return all the institutions and count', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      prismaServiceMock.institution.count.mockResolvedValueOnce(1);
      prismaServiceMock.institution.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'New Institution',
        },
      ]);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        institutions: [
          {
            id: 1,
            name: 'New Institution',
          },
        ],
      });
    });

    it('should return specific data based on search parameters', async () => {
      const query: CommonQuery = {
        search: 'New',
      };

      prismaServiceMock.institution.count.mockResolvedValueOnce(1);
      prismaServiceMock.institution.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'New Institution',
        },
      ]);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        institutions: [
          {
            id: 1,
            name: 'New Institution',
          },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return the institution if exists', async () => {
      prismaServiceMock.institution.findFirst.mockResolvedValueOnce({
        id: 1,
        name: 'New Institution',
      });

      const result = await service.findOne(1);

      expect(result).toEqual({
        id: 1,
        name: 'New Institution',
      });
    });

    it('should throw error if institution does not exist', async () => {
      prismaServiceMock.institution.findFirst.mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update the existing institution', async () => {
      const updateInstitutionInput = {
        id: 1,
        name: 'New Institution Update',
      };

      const expectedResult = {
        id: 1,
        name: 'New Institution Update',
      };

      prismaServiceMock.institution.findFirst.mockResolvedValue({
        id: 1,
        name: 'New Institution',
      });

      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        institutionId: 1,
      });
      prismaServiceMock.institution.update.mockResolvedValueOnce(
        expectedResult,
      );

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(1, updateInstitutionInput, user);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if institution has already been taken', async () => {
      const updateInstitutionInput = {
        id: 2,
        name: 'New Institution Update',
      };

      const existingInstitution = {
        id: 1,
        name: 'New Institution Update',
      };

      prismaServiceMock.institution.findFirst.mockResolvedValue(
        existingInstitution,
      );
      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        institutionId: 1,
      });

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(
        service.update(2, updateInstitutionInput, user),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete the existing institution', async () => {
      prismaServiceMock.institution.findFirst.mockResolvedValue({
        id: 1,
        name: 'New Institution',
      });
      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        institutionId: 1,
      });

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await service.remove(1, user);

      expect(prismaServiceMock.institution.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw error if institution does not exist', async () => {
      prismaServiceMock.institution.findFirst.mockResolvedValue(null);
      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        institutionId: 1,
      });

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(1, user)).rejects.toThrow();
    });

    it('should throw error if user is not allowed to delete the institution', async () => {
      prismaServiceMock.institution.findFirst.mockResolvedValue({
        id: 1,
        name: 'New Institution',
      });
      prismaServiceMock.userDetail.findFirst.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.Student,
      };

      await expect(service.remove(1, user)).rejects.toThrow();
    });
  });
});
