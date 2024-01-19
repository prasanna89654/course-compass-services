import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { AcademicsPrismaService } from 'src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { CommonQuery } from 'src/interfaces/query.interface';
import { JwtPayload } from 'src/middleware/common.entity';
import Roles from 'src/middleware/role.enum';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: AcademicsPrismaService) {}

  async create(userId: number, createCourseInput: CreateCourseInput) {
    await this.checkIfCourseAlreadyExists(createCourseInput.name);
    return this.prismaService.course.create({
      data: {
        userId: userId,
        ...createCourseInput,
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

    const totalCount: number = await this.prismaService.course.count({
      where: whereClause,
    });

    const courses = await this.prismaService.course.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
      include: {
        assignments: {
          include: {
            assignmentRemarks: true,
            subAssignments: {
              include: {
                subAssignmentRemarks: true,
              },
            },
          },
        },
      },
    });

    return { totalCount, courses };
  }

  async findOne(id: number) {
    await this.checkIfCourseExists(id);
    return this.prismaService.course.findUnique({
      where: {
        id: id,
      },
      include: {
        assignments: {
          include: {
            assignmentRemarks: true,
            subAssignments: {
              include: {
                subAssignmentRemarks: true,
              },
            },
          },
        },
      },
    });
  }

  async update(user: JwtPayload, updateCourseInput: UpdateCourseInput) {
    await this.checkIfCourseExists(updateCourseInput.id);
    await this.checkIfUserCan(user, updateCourseInput.id);
    return this.prismaService.course.update({
      where: {
        id: updateCourseInput.id,
      },
      data: updateCourseInput,
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.checkIfCourseExists(id);
    await this.checkIfUserCan(user, id);
    return this.prismaService.course.delete({
      where: {
        id: id,
      },
    });
  }

  async checkIfCourseAlreadyExists(name: string) {
    const course = await this.prismaService.course.findUnique({
      where: {
        name: name,
      },
    });
    if (course) {
      throw new GraphQLError('Course already exists', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  async checkIfCourseExists(id: number) {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: id,
      },
    });
    if (!course) {
      throw new GraphQLError('Course does not exist', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  async checkIfUserCan(user: JwtPayload, id: number) {
    if (user.role === Roles.SuperAdmin) return;
    const course = await this.prismaService.course.findUnique({
      where: {
        id: id,
      },
    });
    if (course.userId !== user.userId) {
      throw new GraphQLError('You are not allowed to perform this action', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }
}
