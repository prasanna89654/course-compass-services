import { Injectable } from '@nestjs/common';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { CommonQuery } from '../../src/interfaces/query.interface';
import { InstitutionResponse } from './entities/institution-response.entity';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

@Injectable()
export class InstitutionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createInstitutionInput: CreateInstitutionInput) {
    await this.checkIfInstitutionExistsForCreate(createInstitutionInput.name);
    return this.prismaService.institution.create({
      data: createInstitutionInput,
    });
  }

  async findAll(query: CommonQuery): Promise<InstitutionResponse> {
    let whereClause: { AND?: object[] } = {};

    if (query.search) {
      whereClause.AND = [
        {
          OR: [{ name: { contains: query.search.toString() } }],
        },
      ];
    }

    const totalCount: number = await this.prismaService.institution.count({
      where: whereClause,
    });

    const institutions = await this.prismaService.institution.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
    });

    return { totalCount, institutions };
  }

  async findOne(id: number) {
    return this.findOrFailInstitution(id);
  }

  async update(
    id: number,
    updateInstitutionInput: UpdateInstitutionInput,
    user: JwtPayload,
  ) {
    // First check if institution with id exists
    await this.findOrFailInstitution(id);

    // then check if the updated institution is allowed to update
    await this.checkIfInstitutionExistsForUpdate(
      updateInstitutionInput.name,
      id,
    );

    await this.checkIfUserCan(user.userId, id, user.role);

    return this.prismaService.institution.update({
      where: { id },
      data: updateInstitutionInput,
    });
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOrFailInstitution(id);

    await this.checkIfUserCan(user.userId, id, user.role);

    return this.prismaService.institution.delete({ where: { id } });
  }

  private async findOrFailInstitution(id: number) {
    const institution = await this.prismaService.institution.findFirst({
      where: { id },
    });

    if (!institution) {
      throw new GraphQLError(`Unable to find the institution with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return institution;
  }

  private async checkIfInstitutionExistsForCreate(name: string): Promise<void> {
    const institution = await this.prismaService.institution.findFirst({
      where: { name },
    });

    if (institution) {
      throw new GraphQLError(`Institution ${name} has already been taken.`, {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfInstitutionExistsForUpdate(
    name: string,
    id: number,
  ): Promise<void> {
    const institution = await this.prismaService.institution.findFirst({
      where: { name },
    });

    if (institution && institution.id !== id) {
      throw new GraphQLError(`Institution ${name} has already been taken.`, {
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
        where: { userId, institutionId: id },
      });

      if (!userDetail) {
        throw new GraphQLError(`You are not allowed to perform this action`, {
          extensions: { code: 'BAD_REQUEST' },
        });
      }
    }
  }
}
