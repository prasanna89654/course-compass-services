import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CommonQuery } from '../../src/interfaces/query.interface';
import { RoleResponse } from './dto/role.response';
import { GraphQLError } from 'graphql';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleInput: CreateRoleInput) {
    await this.checkIfRoleExistsForCreate(createRoleInput.name);
    return this.prismaService.role.create({ data: createRoleInput });
  }

  async findAll(query: CommonQuery): Promise<RoleResponse> {
    const totalCount: number = await this.prismaService.role.count();

    const roles = await this.prismaService.role.findMany({
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      }
    });

    return { totalCount, roles };
  }

  async findOne(id: number) {
    return this.findOrFailRole(id);
  }

  async update(id: number, updateRoleInput: UpdateRoleInput) {
    // check if role with id exists first
    await this.findOrFailRole(id);

    // then check if the updated role is allowed to update
    await this.checkIfRoleExistsForUpdate(updateRoleInput.name, id);

    return this.prismaService.role.update({ where: { id }, data: updateRoleInput });
  }

  async remove(id: number) {
    await this.findOrFailRole(id);
    return this.prismaService.role.delete({ where: { id } });
  }

  private async findOrFailRole(id: number) {
    const role = await this.prismaService.role.findFirst({ where: { id } });

    if (!role) {
      throw new GraphQLError(`Unable to find the role with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return role;
  }

  private async checkIfRoleExistsForCreate(name: string): Promise<void> {
    const role = await this.prismaService.role.findFirst({ where: { name } });

    if (role) {
      throw new GraphQLError(`Role ${name} has already been taken.`, {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfRoleExistsForUpdate(name: string, id: number): Promise<void> {
    const role = await this.prismaService.role.findFirst({ where: { name } });

    if (role && role.id !== id) {
      throw new GraphQLError(`Role ${name} has already been taken.`, {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }
}
