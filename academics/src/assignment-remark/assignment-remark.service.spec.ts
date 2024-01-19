import { Test, TestingModule } from '@nestjs/testing';
import { AcademicsPrismaService } from '../../src/prisma/prisma.service';
import { AssignmentRemarkService } from './assignment-remark.service';
import {
  CreateAssignmentRemarkInput,
  RemarkStatus,
} from './dto/create-assignment-remark.input';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { UpdateAssignmentRemarkInput } from './dto/update-assignment-remark.input';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';

let academicsAssignmentRemark = {
  assignmentId: 1,
  status: RemarkStatus.todo,
  remark: 'Assignment Remark 1',
};

describe('AssignmentRemarkService', () => {
  let service: AssignmentRemarkService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    assignmentRemark: {
      findMany: jest.fn(),
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
        AssignmentRemarkService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AssignmentRemarkService>(AssignmentRemarkService);
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
    it('should create an assignment remark', async () => {
      const assignmentRemark: CreateAssignmentRemarkInput =
        academicsAssignmentRemark;

      const expected = {
        ...assignmentRemark,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.create.mockResolvedValue(expected);

      const result = await service.create(1, assignmentRemark);

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return all assignment remarks and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const expected = [
        {
          ...academicsAssignmentRemark,
          id: 1,
        },
      ];

      prismaServiceMock.assignmentRemark.count.mockResolvedValue(1);

      prismaServiceMock.assignmentRemark.findMany.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(result).toEqual({
        totalCount: 1,
        assignmentRemarks: expected,
      });
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return an assignment remark', async () => {
      const expected = {
        ...academicsAssignmentRemark,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(expected);

      const result = await service.findOne(1);

      expect(result).toEqual(expected);
    });

    it('should throw an error if assignment remark not found', async () => {
      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update an assignment remark', async () => {
      const assignmentRemark: UpdateAssignmentRemarkInput = {
        id: 1,
        ...academicsAssignmentRemark,
      };

      const expected = {
        ...academicsAssignmentRemark,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(expected);

      prismaServiceMock.assignmentRemark.update.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(user, expected);

      expect(result).toEqual(expected);
    });

    it('should throw an error if assignment remark not found', async () => {
      const assignmentRemark: UpdateAssignmentRemarkInput = {
        id: 1,
        ...academicsAssignmentRemark,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(user, assignmentRemark)).rejects.toThrow();
    });

    it("should throw an error if user doesn't have permission", async () => {
      const assignmentRemark: UpdateAssignmentRemarkInput = {
        id: 1,
        ...academicsAssignmentRemark,
      };

      const expected = {
        ...academicsAssignmentRemark,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.update(user, assignmentRemark)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete an assignment remark', async () => {
      const expected = {
        ...academicsAssignmentRemark,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(expected);

      prismaServiceMock.assignmentRemark.delete.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.remove(user, 1);

      expect(result).toEqual(expected);
    });

    it('should throw an error if assignment remark not found', async () => {
      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });

    it("should throw an error if user doesn't have permission", async () => {
      const expected = {
        ...academicsAssignmentRemark,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.assignmentRemark.findUnique.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });
  });
});
