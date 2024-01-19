import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CreateNoteInput } from './dto/create-note.input';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { UpdateNoteInput } from './dto/update-note.input';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from '../../src/middleware/role.enum';

let academicsNote = {
  name: 'Note 1',
  description: 'Note 1 description',
  link: 'https://note1.com',
  isShareable: true,
};

describe('NoteService', () => {
  let service: NoteService;
  let prismaService: AcademicsPrismaService;

  const prismaServiceMock = {
    note: {
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
        NoteService,
        {
          provide: AcademicsPrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
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
    it('should create an note', async () => {
      const note: CreateNoteInput = academicsNote;

      const expected = {
        ...note,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.note.create.mockResolvedValue(expected);

      const result = await service.create(1, note);

      expect(result).toEqual(expected);
    });

    it('should create note if required fields are only provided', async () => {
      const { name, description, isShareable } = academicsNote;

      const note = {
        name,
        description,
        isShareable,
      };

      const expected = {
        ...note,
        userId: 1,
        id: 1,
      };

      prismaServiceMock.note.create.mockResolvedValue(expected);

      const result = await service.create(1, note);

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return all notes and totalCount', async () => {
      const query: CommonQuery = {
        skip: 0,
        take: 10,
        orderBy: 'createdAt',
        sortOrder: SortOrder.DESC,
      };

      const expected = [academicsNote];

      prismaServiceMock.note.count.mockResolvedValue(1);

      prismaServiceMock.note.findMany.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(result).toEqual({
        totalCount: 1,
        notes: expected,
      });
    });
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should return note if found', async () => {
      const expected = {
        id: 1,
        ...academicsNote,
        userId: 1,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(expected);

      const result = await service.findOne(1);

      expect(result).toEqual(expected);
    });

    it('should return null if note not found', async () => {
      prismaServiceMock.note.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should update note if found', async () => {
      const note: UpdateNoteInput = {
        id: 1,
        ...academicsNote,
      };

      const expected = {
        id: 1,
        ...academicsNote,
        userId: 1,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(note);

      prismaServiceMock.note.update.mockResolvedValue(expected);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.update(user, note);

      expect(result).toEqual(expected);
    });

    it('should throw an error if note not found', async () => {
      const note: UpdateNoteInput = {
        id: 1,
        ...academicsNote,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.update(user, note)).rejects.toThrow();
    });

    it('should throw an error if user doesnt have permission', async () => {
      const note: UpdateNoteInput = {
        id: 1,
        ...academicsNote,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(note);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.update(user, note)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    it('should delete note if found', async () => {
      const note = {
        id: 1,
        ...academicsNote,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(note);

      prismaServiceMock.note.delete.mockResolvedValue(note);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      const result = await service.remove(user, 1);

      expect(result).toEqual(note);
    });

    it('should throw an error if note not found', async () => {
      const note = {
        id: 1,
        ...academicsNote,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(null);

      const user: JwtPayload = {
        userId: 1,
        role: Roles.SuperAdmin,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });

    it('should throw an error if user doesnt have permission', async () => {
      const note = {
        id: 1,
        ...academicsNote,
      };

      prismaServiceMock.note.findUnique.mockResolvedValue(note);

      const user: JwtPayload = {
        userId: 2,
        role: Roles.Student,
      };

      await expect(service.remove(user, 1)).rejects.toThrow();
    });
  });
});
