import { Injectable } from '@nestjs/common';
import { CreateStudyLevelInput } from './dto/create-study-level.input';
import { UpdateStudyLevelInput } from './dto/update-study-level.input';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { CommonQuery } from '../../src/interfaces/query.interface';
import { StudyLevelResponse } from './dto/study-level.response';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

@Injectable()
export class StudyLevelService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createStudyLevelInput: CreateStudyLevelInput) {
    await this.checkIfStudyLevelExistsForCreate(createStudyLevelInput.name);
    return this.prismaService.studyLevel.create({
      data: createStudyLevelInput,
    });
  }

  async findAll(query: CommonQuery): Promise<StudyLevelResponse> {
    let whereClause: { AND?: object[] } = {};

    if (query.search) {
      whereClause.AND = [
        {
          OR: [{ name: { contains: query.search.toString() } }],
        },
      ];
    }

    const totalCount: number = await this.prismaService.studyLevel.count({
      where: whereClause,
    });

    const studyLevels = await this.prismaService.studyLevel.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
    });

    return { totalCount, studyLevels };
  }

  async findOne(id: number) {
    return this.findOrFailStudyLevel(id);
  }

  async update(
    id: number,
    updateStudyLevelInput: UpdateStudyLevelInput,
    user: JwtPayload,
  ) {
    // First check if study level with id exists
    await this.findOrFailStudyLevel(id);

    // Then check if the updated study level is allowed to udpate
    await this.checkIfStudyLevelExistsForUpdate(updateStudyLevelInput.name, id);

    await this.checkIfUserCan(user.userId, id, user.role);

    return this.prismaService.studyLevel.update({
      where: { id },
      data: updateStudyLevelInput,
    });
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOrFailStudyLevel(id);
    await this.checkIfUserCan(user.userId, id, user.role);
    return this.prismaService.studyLevel.delete({ where: { id } });
  }

  private async findOrFailStudyLevel(id: number) {
    const studyLevel = await this.prismaService.studyLevel.findFirst({
      where: { id },
    });

    if (!studyLevel) {
      throw new GraphQLError(`Unable to find the study level with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return studyLevel;
  }

  private async checkIfStudyLevelExistsForCreate(name: string): Promise<void> {
    const studyLevel = await this.prismaService.studyLevel.findFirst({
      where: { name },
    });

    if (studyLevel) {
      throw new GraphQLError(`Study Level ${name} has already been taken.`, {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfStudyLevelExistsForUpdate(
    name: string,
    id: number,
  ): Promise<void> {
    const studyLevel = await this.prismaService.studyLevel.findFirst({
      where: { name },
    });

    if (studyLevel && studyLevel.id !== id) {
      throw new GraphQLError(`Study level ${name} has already been taken.`, {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfUserCan(
    userId: number,
    id: number,
    role: Roles,
  ): Promise<void> {
    if (role === Roles.Student) {
      const userDetail = await this.prismaService.userDetail.findFirst({
        where: { userId, studyLevelId: id },
      });

      if (!userDetail) {
        throw new GraphQLError(`You are not allowed to perform this action.`, {
          extensions: { code: 'BAD_REQUEST' },
        });
      }
    }
  }
}
