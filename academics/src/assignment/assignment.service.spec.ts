import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentService } from './assignment.service';
import {
  AssignmentPriority,
  AssignmentStatus,
  CreateAssignmentInput,
} from './dto/create-assignment.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';
import { UpdateAssignmentInput } from './dto/update-assignment.input';

let academicsAssignment = {
  name: 'Assignment 1',
  description: 'Assignment 1 Description',
  link: 'https://assignment1.com',
  file_path: 'assignment1.pdf',
  startDate: '2021-05-01T00:00:00.000Z',
  endDate: '2021-05-10T00:00:00.000Z',
  priority: AssignmentPriority.high,
  status: AssignmentStatus.in_progress,
  courseId: 1,
};

describe('AssignmentService', () => {
  let service: AssignmentService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    assignment: {
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
        AssignmentService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
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
    it('should create an assignment', async () => {
      const assignment: CreateAssignmentInput = academicsAssignment;

      const expected = {
        ...assignment,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.assignment.create.mockResolvedValue(expected);

      const result = await service.create(1, assignment);

      expect(result).toEqual(expected);
    });

    it('should throw an error if assignment already exists', async () => {
      const assignment: CreateAssignmentInput = academicsAssignment;

      prismaServiceMock.assignment.findUnique.mockResolvedValue(assignment);

      await expect(service.create(1, assignment)).rejects.toThrow();
    });

    it('should create an assignment if required field are only provided', async () => {
      const { name, startDate, endDate, priority, status, courseId } =
        academicsAssignment;

      const assignment: CreateAssignmentInput = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        status: status,
        courseId: courseId,
      };

      const expected = {
        ...assignment,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.assignment.create.mockResolvedValue(expected);

      const result = await service.create(1, assignment);

      expect(result).toEqual(expected);
    });

    describe('findMany', () => {
      afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });
      it('should return all assignments and totalCount', async () => {
        const query: CommonQuery = {
          skip: 0,
          take: 10,
          orderBy: 'createdAt',
          sortOrder: SortOrder.DESC,
        };

        const expected = [academicsAssignment];

        prismaServiceMock.assignment.count.mockResolvedValue(1);
        prismaServiceMock.assignment.findMany.mockResolvedValue(expected);

        const result = await service.findAll(query);

        expect(result).toEqual({
          totalCount: 1,
          assignments: expected,
        });
      });
    });

    describe('findOne', () => {
      afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });
      it('should return an assignment', async () => {
        const expected = {
          id: 1,
          ...academicsAssignment,
          userId: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(expected);

        const result = await service.findOne(1);

        expect(result).toEqual(expected);
      });

      it("should throw an error if assignment doesn't exist", async () => {
        prismaServiceMock.assignment.findUnique.mockResolvedValue(null);

        await expect(service.findOne(1)).rejects.toThrow();
      });
    });

    describe('update', () => {
      afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });
      it('should update an assignment', async () => {
        const assignment: UpdateAssignmentInput = {
          ...academicsAssignment,
          id: 1,
        };

        const expected = {
          ...assignment,
          userId: 1,
          id: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(assignment);

        prismaServiceMock.assignment.update.mockResolvedValue(expected);

        const user: JwtPayload = {
          userId: 1,
          role: Roles.SuperAdmin,
        };

        const result = await service.update(user, assignment);
        expect(result).toEqual(expected);
      });

      it("should throw an error if assignment doesn't exist", async () => {
        const assignment: UpdateAssignmentInput = {
          ...academicsAssignment,
          id: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(null);

        const user: JwtPayload = {
          userId: 1,
          role: Roles.SuperAdmin,
        };

        await expect(service.update(user, assignment)).rejects.toThrow();
      });

      it("should throw an error if user doesn't have permission", async () => {
        const assignment = {
          ...academicsAssignment,
          id: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(assignment);

        const user: JwtPayload = {
          userId: 2,
          role: Roles.Student,
        };

        await expect(service.update(user, assignment)).rejects.toThrow();
      });
    });

    describe('remove', () => {
      afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });
      it('should delete an assignment', async () => {
        const expected = {
          id: 1,
          ...academicsAssignment,
          userId: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(expected);

        prismaServiceMock.assignment.delete.mockResolvedValue(expected);

        const user: JwtPayload = {
          userId: 1,
          role: Roles.SuperAdmin,
        };

        const result = await service.remove(user, 1);

        expect(result).toEqual(expected);
      });

      it("should throw an error if assignment doesn't exist", async () => {
        prismaServiceMock.assignment.findUnique.mockResolvedValue(null);

        const user: JwtPayload = {
          userId: 1,
          role: Roles.SuperAdmin,
        };

        await expect(service.remove(user, 1)).rejects.toThrow();
      });

      it("should throw an error if user doesn't have permission", async () => {
        const assignment = {
          ...academicsAssignment,
          id: 1,
        };

        prismaServiceMock.assignment.findUnique.mockResolvedValue(assignment);

        const user: JwtPayload = {
          userId: 2,
          role: Roles.Student,
        };

        await expect(service.remove(user, 1)).rejects.toThrow();
      });
    });
  });
});
