import { Injectable } from '@nestjs/common';
import { CreateSubAssignmentInput } from './dto/create-sub-assignment.input';
import { UpdateSubAssignmentInput } from './dto/update-sub-assignment.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CommonQuery } from 'src/interfaces/query.interface';
import { JwtPayload } from 'src/middleware/common.entity';
import { GraphQLError } from 'graphql';
import Roles from 'src/middleware/role.enum';

@Injectable()
export class SubAssignmentService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}

  async create(
    userId: number,
    createSubAssignmentInput: CreateSubAssignmentInput,
  ) {
    await this.checkIfSubAssignmentTitleAlreadyExists(
      createSubAssignmentInput.name,
    );
    return this.prismaService.subAssignment.create({
      data: {
        userId: userId,
        ...createSubAssignmentInput,
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

    const totalCount: number = await this.prismaService.subAssignment.count({
      where: whereClause,
    });

    const subAssignments = await this.prismaService.subAssignment.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
      include: {
        subAssignmentRemarks: true,
        assignment: true,
      },
    });

    return { totalCount, subAssignments };
  }

  async findOne(id: number) {
    await this.checkIfSubAssignmentExists(id);
    return this.prismaService.subAssignment.findUnique({
      where: {
        id: id,
      },
      include: {
        subAssignmentRemarks: true,
        assignment: true,
      },
    });
  }

  async update(
    user: JwtPayload,
    updateSubAssignmentInput: UpdateSubAssignmentInput,
  ) {
    await this.checkIfSubAssignmentExists(updateSubAssignmentInput.id);
    await this.checkIfUserCan(user, updateSubAssignmentInput.id);
    return this.prismaService.subAssignment.update({
      where: {
        id: updateSubAssignmentInput.id,
      },
      data: {
        ...updateSubAssignmentInput,
      },
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfSubAssignmentExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.subAssignment.delete({
      where: {
        id: id,
      },
    });
  }

  async checkIfSubAssignmentTitleAlreadyExists(name: string) {
    const subAssignment = await this.prismaService.subAssignment.findFirst({
      where: {
        name: name,
      },
    });
    if (subAssignment) {
      throw new GraphQLError('SubAssignment already exists', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfSubAssignmentExists(id: number) {
    const subAssignment = await this.prismaService.subAssignment.findUnique({
      where: {
        id: id,
      },
    });

    if (!subAssignment) {
      throw new GraphQLError(
        `Unable to find the Sub Assignment with id ${id}`,
        {
          extensions: { code: 'NOT_FOUND' },
        },
      );
    }
  }

  private async checkIfUserCan(user: JwtPayload, id: number) {
    if (user.role === Roles.SuperAdmin) return;
    const subAssignment = await this.prismaService.subAssignment.findUnique({
      where: {
        id: id,
      },
    });

    if (subAssignment.userId !== user.userId) {
      throw new GraphQLError('You are not allowed to perform this action', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }
}
