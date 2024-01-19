import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';

describe('RoleService', () => {
  let roleService: RoleService;
  let prismaService: PrismaService;

  const prismaServiceMock = {
    role: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleInput = {
        name: 'NewRole',
      };

      const expectedResult = {
        id: 1,
        name: 'NewRole',
      };

      prismaServiceMock.role.create.mockResolvedValueOnce(expectedResult);

      const result = await roleService.create(createRoleInput);

      expect(result).toEqual(expectedResult);
      expect(prismaService.role.create).toHaveBeenCalledWith({ data: createRoleInput });
    });

    it('should throw error if a role already exists', async () => {
      const createRoleInput = {
        name: 'NewRole',
      };

      const existingRole = {
        id: 1,
        name: 'NewRole',
      };

      prismaServiceMock.role.findFirst.mockResolvedValueOnce(existingRole);

      await expect(roleService.create(createRoleInput)).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should return all the roles and count', async() => {
      const query: CommonQuery = {
        skip: 0, take: 10, orderBy: "createdAt", sortOrder: SortOrder.DESC,
      };

      prismaServiceMock.role.count.mockResolvedValueOnce(1);
      prismaServiceMock.role.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: "NewRole",
        },
      ]);

      const result = await roleService.findAll(query);
      expect(result).toEqual({
        totalCount: 1,
        roles: [
          {
            id: 1,
            name: "NewRole",
          }
        ],
      });
    });
  });

  describe("findOne", () => {
    it("should return the role if exists", async () => {
      prismaServiceMock.role.findFirst.mockResolvedValueOnce({
        id: 1,
        name: "NewRole",
      });

      const result = await roleService.findOne(1);

      expect(result).toEqual({
        id: 1,
        name: "NewRole",
      });
    });

    it('should throw error if role does not exist', async() => {
      prismaServiceMock.role.findFirst.mockResolvedValueOnce(null);

      await expect(roleService.findOne(1)).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update the existing role", async () => {
      const updateRoleInput = {
        id: 1,
        name: 'NewRole Update',
      };

      const expectedResult = {
        id: 1,
        name: 'NewRole Update',
      };

      prismaServiceMock.role.findFirst.mockResolvedValue({
        id: 1,
        name: "NewRole",
      });
      prismaServiceMock.role.update.mockResolvedValueOnce(expectedResult);

      const result = await roleService.update(1, updateRoleInput);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if role has already been taken', async () => {
      const updateRoleInput = {
        id: 2,
        name: 'NewRole Update',
      };

      const existingRole = {
        id: 1,
        name: 'NewRole Update',
      };

      prismaServiceMock.role.findFirst.mockResolvedValue(existingRole);

      await expect(roleService.update(2, updateRoleInput)).rejects.toThrow();
    });
  });

  describe("remove", () => {
    it("should delete the existing role", async () => {
      prismaServiceMock.role.findFirst.mockResolvedValue({
        id: 1,
        name: "NewRole",
      });

      await roleService.remove(1);

      expect(prismaServiceMock.role.delete).toHaveBeenCalledTimes(1);
    });
  });
});
