import { Test, TestingModule } from '@nestjs/testing';
import { StudyLevelService } from './study-level.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

describe('StudyLevelService', () => {
  let service: StudyLevelService;
  let prismaService: PrismaService;

  const prismaServiceMock = {
    studyLevel: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userDetail:{
      findFirst: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyLevelService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<StudyLevelService>(StudyLevelService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new study level', async () => {
      const createStudyLevelInput = {
        name: 'NewStudyLevel',
      };

      const expectedResult = {
        id: 1,
        name: 'NewStudyLevel',
      };

      prismaServiceMock.studyLevel.create.mockResolvedValueOnce(expectedResult);

      const result = await service.create(createStudyLevelInput);

      expect(result).toEqual(expectedResult);
      expect(prismaService.studyLevel.create).toHaveBeenCalledWith({ data: createStudyLevelInput });
    });

    it('should throw error if a study level already exists', async () => {
      const createStudyLevelInput = {
        name: 'NewStudyLevel',
      };

      const existingRole = {
        id: 1,
        name: 'NewStudyLevel',
      };

      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce(existingRole);

      await expect(service.create(createStudyLevelInput)).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should return all the study levels and count', async() => {
      const query: CommonQuery = {
        skip: 0, take: 10, orderBy: "createdAt", sortOrder: SortOrder.DESC,
      };

      prismaServiceMock.studyLevel.count.mockResolvedValueOnce(1);
      prismaServiceMock.studyLevel.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: "NewStudyLevel",
        },
      ]);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        studyLevels: [
          {
            id: 1,
            name: "NewStudyLevel",
          }
        ],
      });
    });

    it("should return specific data based on search parameters", async () => {
      const query: CommonQuery = {
        search: "New",
      };

      prismaServiceMock.studyLevel.count.mockResolvedValueOnce(1);
      prismaServiceMock.studyLevel.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: "NewStudyLevel",
        },
      ]);

      const result = await service.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        studyLevels: [
          {
            id: 1,
            name: "NewStudyLevel",
          }
        ],
      });
    });
  });

  describe("findOne", () => {
    it("should return the study level if exists", async () => {
      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce({
        id: 1,
        name: "NewStudyLevel",
      });

      const result = await service.findOne(1);

      expect(result).toEqual({
        id: 1,
        name: "NewStudyLevel",
      });
    });

    it('should throw error if study level does not exist', async() => {
      prismaServiceMock.studyLevel.findFirst.mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update the existing study level", async () => {
      const updateStudyLevelInput = {
        id: 1,
        name: 'NewStudyLevel Update',
      };

      const expectedResult = {
        id: 1,
        name: 'NewStudyLevel Update',
      };

      prismaServiceMock.studyLevel.findFirst.mockResolvedValue({
        id: 1,
        name: "NewStudyLevel",
      });

      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        studyLevelId: 1,
      });
      prismaServiceMock.studyLevel.update.mockResolvedValueOnce(expectedResult);

      const user:JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(1, updateStudyLevelInput, user);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if study level has already been taken', async () => {
      const updateStudyLevelInput = {
        id: 2,
        name: 'NewStudyLevel Update',
      };

      const existingStudyLevel = {
        id: 1,
        name: 'NewStudyLevel Update',
      };

      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        studyLevelId: 1,
      });

      prismaServiceMock.studyLevel.findFirst.mockResolvedValue(existingStudyLevel);

      const user:JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(2, updateStudyLevelInput, user)).rejects.toThrow();
    });
  });

  describe("remove", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it("should delete the existing study level", async () => {
      prismaServiceMock.studyLevel.findFirst.mockResolvedValue({
        id: 1,
        name: "NewStudyLevel",
      });

      prismaServiceMock.userDetail.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        studyLevelId: 1,
      });

      const user:JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await service.remove(1, user);

      expect(prismaServiceMock.studyLevel.delete).toHaveBeenCalledTimes(1);
    });

    it("should throw error if study level does not exist", async () => {
      prismaServiceMock.studyLevel.findFirst.mockResolvedValue(null);

      const user:JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(1, user)).rejects.toThrow();
    });

    it("should throw error if user is not allowed to delete the study level", async () => {
      prismaServiceMock.studyLevel.findFirst.mockResolvedValue({
        id: 1,
        name: "NewStudyLevel",
      });

      prismaServiceMock.userDetail.findFirst.mockResolvedValue(null);

      const user:JwtPayload = {
        userId: 1,
        role: Roles.Student,
      };

      await expect(service.remove(1, user)).rejects.toThrow();
    });
  });
});
