import { Injectable } from '@nestjs/common';
import { CreateAssignmentRemarkInput } from './dto/create-assignment-remark.input';
import { UpdateAssignmentRemarkInput } from './dto/update-assignment-remark.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CommonQuery } from 'src/interfaces/query.interface';
import { GraphQLError } from 'graphql';
import { JwtPayload } from 'src/middleware/common.entity';
import Roles from 'src/middleware/role.enum';

@Injectable()
export class AssignmentRemarkService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}

  create(
    userId: number,
    createAssignmentRemarkInput: CreateAssignmentRemarkInput,
  ) {
    return this.prismaService.assignmentRemark.create({
      data: {
        userId: userId,
        ...createAssignmentRemarkInput,
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

    const totalCount: number = await this.prismaService.assignmentRemark.count({
      where: whereClause,
    });

    const assignmentRemarks =
      await this.prismaService.assignmentRemark.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
        orderBy: {
          [query.orderBy]: query.sortOrder,
        },
        include: {
          assignment: true,
        },
      });

    return { totalCount, assignmentRemarks };
  }

  async findOne(id: number) {
    await this.checkIfAssignmentRemarkExists(id);
    return this.prismaService.assignmentRemark.findUnique({
      where: {
        id: id,
      },
      include: {
        assignment: true,
      },
    });
  }

  async update(
    user: JwtPayload,
    updateAssignmentRemarkInput: UpdateAssignmentRemarkInput,
  ) {
    await this.checkIfAssignmentRemarkExists(updateAssignmentRemarkInput.id);

    await this.checkIfUserCan(user, updateAssignmentRemarkInput.id);

    return this.prismaService.assignmentRemark.update({
      where: {
        id: updateAssignmentRemarkInput.id,
      },
      data: updateAssignmentRemarkInput,
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfAssignmentRemarkExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.assignmentRemark.delete({
      where: {
        id: id,
      },
    });
  }

  private async checkIfAssignmentRemarkExists(id: number) {
    const assignmentRemark =
      await this.prismaService.assignmentRemark.findUnique({
        where: {
          id: id,
        },
      });

    if (!assignmentRemark) {
      throw new GraphQLError(
        `Unable to find the assignment remark with id ${id}`,
        {
          extensions: { code: 'NOT_FOUND' },
        },
      );
    }
  }

  private async checkIfUserCan(user: JwtPayload, id: number) {
    if (user.role === Roles.SuperAdmin) return;
    const assignmentRemark =
      await this.prismaService.assignmentRemark.findUnique({
        where: {
          id: id,
        },
      });

    if (assignmentRemark.userId !== user.userId) {
      throw new GraphQLError(`You are not allowed to perform this action`, {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
  }
}
