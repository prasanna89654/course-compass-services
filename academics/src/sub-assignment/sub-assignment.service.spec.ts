import { Test, TestingModule } from '@nestjs/testing';
import { SubAssignmentService } from './sub-assignment.service';
import {
  CreateSubAssignmentInput,
  SubAssignmentStatus,
} from './dto/create-sub-assignment.input';
import { AcademicsPrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { UpdateSubAssignmentInput } from './dto/update-sub-assignment.input';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';

let academicsSubAssignment = {
  assignmentId: 1,
  name: 'SubAssignment 1',
  description: 'SubAssignment 1 description',
  startDate: '2021-05-01T00:00:00.000Z',
  endDate: '2021-05-10T00:00:00.000Z',
  status: SubAssignmentStatus.todo,
};

describe('SubAssignmentService', () => {
  let service: SubAssignmentService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    subAssignment: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubAssignmentService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<SubAssignmentService>(SubAssignmentService);
    prismaService = module.get<AcademicsPrismaService>(AcademicsPrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should create an subAssignment', async () => {
      const subAssignment: CreateSubAssignmentInput = academicsSubAssignment;

      const expected = {
        ...subAssignment,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.subAssignment.findFirst.mockResolvedValue(null);

      prismaServiceMock.subAssignment.create.mockResolvedValue(expected);

      const result = await service.create(1, subAssignment);

      expect(result).toEqual(expected);
    });

    it('should create subAssignment if required fields are only provided', async () => {
      const { assignmentId, name, startDate, endDate, status } =
        academicsSubAssignment;

      const subAssignment = {
        assignmentId,
        name,
        startDate,
        endDate,
        status,
      };

      const expected = {
        ...subAssignment,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.subAssignment.findFirst.mockResolvedValue(null);

      prismaServiceMock.subAssignment.create.mockResolvedValue(expected);

      const result = await service.create(1, subAssignment);

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return all subAssignments and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const expected = [academicsSubAssignment];

      prismaServiceMock.subAssignment.count.mockResolvedValue(1);

      prismaServiceMock.subAssignment.findMany.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(result).toEqual({
        totalCount: 1,
        subAssignments: expected,
      });
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return subAssignment if found', async () => {
      const expected = {
        id: 1,
        ...academicsSubAssignment,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(expected);

      const result = await service.findOne(1);

      expect(result).toEqual(expected);
    });

    it('should throw an error if subAssignment not found', async () => {
      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update an subAssignment', async () => {
      const subAssignment: UpdateSubAssignmentInput = {
        ...academicsSubAssignment,
        id: 1,
      };

      const expected = {
        ...subAssignment,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(
        subAssignment,
      );

      prismaServiceMock.subAssignment.update.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(user, subAssignment);

      expect(result).toEqual(expected);
    });

    it('should throw an error if subAssignment not found', async () => {
      const subAssignment: UpdateSubAssignmentInput = {
        ...academicsSubAssignment,
        id: 1,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(user, subAssignment)).rejects.toThrow();
    });

    it('should throw an error if user doesnt have permission', async () => {
      const subAssignment: UpdateSubAssignmentInput = {
        ...academicsSubAssignment,
        id: 1,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(
        subAssignment,
      );

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.update(user, subAssignment)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete an subAssignment', async () => {
      const subAssignment = {
        id: 1,
        ...academicsSubAssignment,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(
        subAssignment,
      );

      prismaServiceMock.subAssignment.delete.mockResolvedValue(subAssignment);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.remove(user, 1);

      expect(result).toEqual(subAssignment);
    });

    it('should throw an error if subAssignment not found', async () => {
      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });

    it('should throw an error if user doesnt have permission', async () => {
      const subAssignment = {
        id: 1,
        ...academicsSubAssignment,
      };

      prismaServiceMock.subAssignment.findUnique.mockResolvedValue(
        subAssignment,
      );

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });
  });
});
