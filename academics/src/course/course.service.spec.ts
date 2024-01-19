import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { AcademicsPrismaService } from '../../src/prisma/prisma.service';
import { CreateCourseInput, Semester, Year } from './dto/create-course.input';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { UpdateCourseInput } from './dto/update-course.input';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';

let academicsCourse = {
  name: 'Course 1',
  semester: Semester.first,
  year: Year.first,
};

describe('CourseService', () => {
  let service: CourseService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    course: {
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
        CourseService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
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
    it('should create an course', async () => {
      const course: CreateCourseInput = academicsCourse;

      const expected = {
        ...course,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.course.create.mockResolvedValue(expected);

      const result = await service.create(1, course);

      expect(result).toEqual(expected);
    });

    it('should throw an error if course already exists', async () => {
      const course: CreateCourseInput = academicsCourse;

      prismaServiceMock.course.findUnique.mockResolvedValue(course);

      await expect(service.create(1, course)).rejects.toThrowError();
    });

    it('should create course if required fields are only provided', async () => {
      const { name } = academicsCourse;

      const course = {
        name: name,
      };

      const expected = {
        ...course,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.course.create.mockResolvedValue(expected);

      const result = await service.create(1, course);

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return all courses and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const expected = [academicsCourse];

      prismaServiceMock.course.count.mockResolvedValue(1);

      prismaServiceMock.course.findMany.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(result).toEqual({
        totalCount: 1,
        courses: expected,
      });
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return course if found', async () => {
      const expected = {
        id: 1,
        ...academicsCourse,
        userId: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(expected);

      const result = await service.findOne(1);

      expect(result).toEqual(expected);
    });

    it('should throw an error if course not found', async () => {
      prismaServiceMock.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update course if found', async () => {
      const course: UpdateCourseInput = {
        ...academicsCourse,
        id: 1,
      };

      const expected = {
        id: 1,
        ...course,
        userId: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(course);

      prismaServiceMock.course.update.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(user, course);

      expect(result).toEqual(expected);
    });

    it('should throw an error if course not found', async () => {
      const course: UpdateCourseInput = {
        ...academicsCourse,
        id: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(user, course)).rejects.toThrow();
    });

    it("should throw an error if user doesn't have permission", async () => {
      const course: UpdateCourseInput = {
        ...academicsCourse,
        id: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(course);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.update(user, course)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete course if found', async () => {
      const course = {
        id: 1,
        ...academicsCourse,
        userId: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(course);

      prismaServiceMock.course.delete.mockResolvedValue(course);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.remove(user, 1);

      expect(result).toEqual(course);
    });

    it('should throw an error if course not found', async () => {
      prismaServiceMock.course.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });

    it("should throw an error if user doesn't have permission", async () => {
      const course = {
        id: 1,
        ...academicsCourse,
        userId: 1,
      };

      prismaServiceMock.course.findUnique.mockResolvedValue(course);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });
  });
});
