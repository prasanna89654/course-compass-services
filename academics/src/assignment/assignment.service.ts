import { Injectable } from '@nestjs/common';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { CommonQuery } from 'src/interfaces/query.interface';
import { JwtPayload } from 'src/middleware/common.entity';
import Roles from 'src/middleware/role.enum';

@Injectable()
export class AssignmentService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}

  async create(userId: number, createAssignmentInput: CreateAssignmentInput) {
    await this.checkIfAssignmentAlreadyExists(createAssignmentInput.name);
    return this.prismaService.assignment.create({
      data: {
        userId: userId,
        ...createAssignmentInput,
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

    const totalCount: number = await this.prismaService.assignment.count({
      where: whereClause,
    });

    const assignments = await this.prismaService.assignment.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
      include: {
        course: true,
        assignmentRemarks: true,
        subAssignments: {
          include: {
            subAssignmentRemarks: true,
          },
        },
      },
    });

    return { totalCount, assignments };
  }

  async findOne(id: number) {
    await this.checkIfAssignmentExists(id);
    return this.prismaService.assignment.findUnique({
      where: {
        id: id,
      },
      include: {
        assignmentRemarks: true,
        course: true,
        subAssignments: {
          include: {
            subAssignmentRemarks: true,
          },
        },
      },
    });
  }

  async update(user: JwtPayload, updateAssignmentInput: UpdateAssignmentInput) {
    await this.checkIfAssignmentExists(updateAssignmentInput.id);
    await this.checkIfUserCan(user, updateAssignmentInput.id);
    return this.prismaService.assignment.update({
      where: { id: updateAssignmentInput.id },
      data: updateAssignmentInput,
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfAssignmentExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.assignment.delete({ where: { id } });
  }

  async checkIfAssignmentAlreadyExists(name: string) {
    const assignment = await this.prismaService.assignment.findUnique({
      where: {
        name: name,
      },
    });

    if (assignment) {
      throw new GraphQLError('Assignment already exists', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  async checkIfAssignmentExists(id: number) {
    const assignment = await this.prismaService.assignment.findUnique({
      where: {
        id: id,
      },
    });

    if (!assignment) {
      throw new GraphQLError(`Unable to find the assignment with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
  }

  async checkIfUserCan(user: JwtPayload, id: number) {
    if (user.role === Roles.SuperAdmin) return;
    const assignment = await this.prismaService.assignment.findUnique({
      where: {
        id: id,
      },
    });

    if (assignment.userId !== user.userId) {
      throw new GraphQLError(`You are not authorized to perform this action`, {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
  }
}
