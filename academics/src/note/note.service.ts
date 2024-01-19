import { Injectable } from '@nestjs/common';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CommonQuery } from '../../src/interfaces/query.interface';
import { JwtPayload } from '../../src/middleware/common.entity';
import Roles from 'src/middleware/role.enum';
import { GraphQLError } from 'graphql';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}
  create(
    userId: number,
    createNoteInput: CreateNoteInput) {
    return this.prismaService.note.create({
      data: {
        userId: userId,
        ...createNoteInput,
      },
    });
  }

  async findAll(query: CommonQuery) {
    let whereClause: { AND?: object[] } = {};

    if (query.search) {
      whereClause.AND = [
        {
          OR: [{ name: { contains: query.search.toString() } }],
        },
      ];
    }

    const totalCount: number = await this.prismaService.note.count({
      where: whereClause,
    });

    const notes =
      await this.prismaService.note.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
        orderBy: {
          [query.orderBy]: query.sortOrder,
        },
      });

    return { totalCount, notes };
  }


  async findOne(id: number) {
    await this.checkIfNoteExists(id);
    return this.prismaService.note.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(user: JwtPayload, updateNoteInput: UpdateNoteInput) {
    await this.checkIfNoteExists(updateNoteInput.id);
    await this.checkIfUserCan(user, updateNoteInput.id);
    return this.prismaService.note.update({
      where: {
        id: updateNoteInput.id,
      },
      data: updateNoteInput,
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfNoteExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.note.delete({
      where: {
        id: id,
      },
    });
  }

  private async checkIfNoteExists(id: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!note) {
      throw new GraphQLError(
        `Unable to find the assignment remark with id ${id}`,
        {
          extensions: { code: 'NOT_FOUND' },
        },
      );
    }
  }

  private async checkIfUserCan(user: JwtPayload, id: number) {
    if(user.role === Roles.SuperAdmin) return;
    const note = await this.prismaService.note.findUnique({
      where: {
        id: id,
      },
    });

    if (note.userId !== user.userId) {
      throw new GraphQLError(`You are not allowed to perform this action`, {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
  }
}
