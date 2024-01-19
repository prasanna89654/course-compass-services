import { Test, TestingModule } from '@nestjs/testing';
import { SubAssignmentRemarkService } from './sub-assignment-remark.service';
import { CreateSubAssignmentRemarkInput, SubAssignmentRemarkStatus } from './dto/create-sub-assignment-remark.input';
import { AcademicsPrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { UpdateSubAssignmentRemarkInput } from './dto/update-sub-assignment-remark.input';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';

let academicsSubAssignmentRemark = {
  subAssignmentId: 1,
  status: SubAssignmentRemarkStatus.review,
  remark: 'SubAssignmentRemark 1 remark',
};

describe('SubAssignmentRemarkService', () => {
  let service: SubAssignmentRemarkService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    subAssignmentRemark: {
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
        SubAssignmentRemarkService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<SubAssignmentRemarkService>(SubAssignmentRemarkService);
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
    it('should create an subAssignmentRemark', async () => {
      const subAssignmentRemark: CreateSubAssignmentRemarkInput = academicsSubAssignmentRemark;

      const expected = {
        ...subAssignmentRemark,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.subAssignmentRemark.create.mockResolvedValue(expected);

      const result = await service.create(1, subAssignmentRemark);

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return all subAssignmentRemarks and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const subAssignmentRemark = [academicsSubAssignmentRemark];

      prismaServiceMock.subAssignmentRemark.count.mockResolvedValue(1);

      prismaServiceMock.subAssignmentRemark.findMany.mockResolvedValue(subAssignmentRemark);

      const result = await service.findAll(query);

      expect(result).toEqual({
        totalCount: 1,
        subAssignmentRemarks: subAssignmentRemark,
      });
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return subAssignmentRemark if found', async () => {
      const expected = {
        id: 1,
        ...academicsSubAssignmentRemark,
        userId: 1,
      };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(expected);

      const result = await service.findOne(1);

      expect(result).toEqual(expected);
    });

    it('should throw error if doesnt exists', async () => {
      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update subAssignmentRemark if found', async () => {
      const subAssignmentRemark: UpdateSubAssignmentRemarkInput = {
       ...academicsSubAssignmentRemark,
       id: 1
      };

      const expected = {
        id: 1,
        ...subAssignmentRemark,
        userId: 1,
      };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(subAssignmentRemark);

      prismaServiceMock.subAssignmentRemark.update.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };
      
      const result = await service.update(user, subAssignmentRemark);
      expect(result).toEqual(expected);
    });

    it('should throw error if doesnt exists', async () => {
      const subAssignmentRemark: UpdateSubAssignmentRemarkInput = {
        ...academicsSubAssignmentRemark,
        id: 1
       };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(user, subAssignmentRemark)).rejects.toThrow();
    });

    it('should throw error if user doesnt have permission', async () => {
      const subAssignmentRemark: UpdateSubAssignmentRemarkInput = {
        ...academicsSubAssignmentRemark,
        id: 1
       };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(subAssignmentRemark);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.update(user, subAssignmentRemark)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete subAssignmentRemark if found', async () => {
      const subAssignmentRemark = {
        ...academicsSubAssignmentRemark,
        id: 1,
      };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(subAssignmentRemark);

      prismaServiceMock.subAssignmentRemark.delete.mockResolvedValue(subAssignmentRemark);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.remove(user, 1);

      expect(result).toEqual(subAssignmentRemark);
    });

    it('should throw error if doesnt exists', async () => {
      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });

    it('should throw error if user doesnt have permission', async () => {
      const subAssignmentRemark = {
        ...academicsSubAssignmentRemark,
        id: 1,
      };

      prismaServiceMock.subAssignmentRemark.findUnique.mockResolvedValue(subAssignmentRemark);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });
  });
});
