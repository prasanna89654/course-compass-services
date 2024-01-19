import { Injectable } from '@nestjs/common';
import { CreateSubAssignmentRemarkInput } from './dto/create-sub-assignment-remark.input';
import { UpdateSubAssignmentRemarkInput } from './dto/update-sub-assignment-remark.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { CommonQuery } from 'src/interfaces/query.interface';
import { JwtPayload } from 'src/middleware/common.entity';
import { GraphQLError } from 'graphql';
import Roles from 'src/middleware/role.enum';

@Injectable()
export class SubAssignmentRemarkService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}

  create(
    userId: number,
    createSubAssignmentRemarkInput: CreateSubAssignmentRemarkInput,
  ) {
    return this.prismaService.subAssignmentRemark.create({
      data: {
        userId: userId,
        ...createSubAssignmentRemarkInput,
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

    const totalCount: number =
      await this.prismaService.subAssignmentRemark.count({
        where: whereClause,
      });

    const subAssignmentRemarks =
      await this.prismaService.subAssignmentRemark.findMany({
        where: whereClause,
        skip: query.skip,
        take: query.take,
        orderBy: {
          [query.orderBy]: query.sortOrder,
        },
        include: {
          subAssignment: {
            include: {
              assignment: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

    return { totalCount, subAssignmentRemarks };
  }

  async findOne(id: number) {
    await this.checkIfSubAssignmentRemarkExists(id);
    return this.prismaService.subAssignmentRemark.findUnique({
      where: {
        id: id,
      },
      include: {
        subAssignment: {
          include: {
            assignment: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    user: JwtPayload,
    updateSubAssignmentRemarkInput: UpdateSubAssignmentRemarkInput,
  ) {
    await this.checkIfSubAssignmentRemarkExists(
      updateSubAssignmentRemarkInput.id,
    );
    await this.checkIfUserCan(user, updateSubAssignmentRemarkInput.id);
    return this.prismaService.subAssignmentRemark.update({
      where: {
        id: updateSubAssignmentRemarkInput.id,
      },
      data: {
        ...updateSubAssignmentRemarkInput,
      },
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfSubAssignmentRemarkExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.subAssignmentRemark.delete({
      where: {
        id: id,
      },
    });
  }

  private async checkIfSubAssignmentRemarkExists(id: number) {
    const subAssignmentRemark =
      await this.prismaService.subAssignmentRemark.findUnique({
        where: {
          id: id,
        },
      });

    if (!subAssignmentRemark) {
      throw new GraphQLError(
        `Unable to find the sub assignment remark with id ${id}`,
        {
          extensions: { code: 'NOT_FOUND' },
        },
      );
    }
  }

  private async checkIfUserCan(user: JwtPayload, id: number) {
    if (user.role === Roles.SuperAdmin) return;
    const subAssignmentRemark =
      await this.prismaService.subAssignmentRemark.findUnique({
        where: {
          id: id,
        },
      });

    if (subAssignmentRemark.userId !== user.userId) {
      throw new GraphQLError(`You are not allowed to perform this action`, {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
  }
}
