import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { RoleResponse } from './dto/role.response';
import Roles from 'src/auth/entities/role.enum';
import RoleGuard from 'src/auth/guards/role.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(RoleGuard([Roles.SuperAdmin]))
@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role)
  async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Query(() => RoleResponse, { name: 'roles' })
  async findAll(
    @Args("skip", { nullable: true }) skip?: number,
    @Args("take", { nullable: true }) take?: number,
    @Args("orderBy", { nullable: true }) orderBy?: string,
    @Args("sortOrder", { nullable: true }) sortOrder?: SortOrder,
  ) {
    const query: CommonQuery = {
      skip: skip || 0,
      take: take || 25,
      orderBy: orderBy || "createdAt",
      sortOrder: sortOrder || SortOrder.DESC,
    };

    return this.roleService.findAll(query);
  }

  @Query(() => Role, { name: 'role' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.findOne(id);
  }

  @Mutation(() => Role)
  async updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.roleService.update(updateRoleInput.id, updateRoleInput);
  }

  @Mutation(() => Role)
  async removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.remove(id);
  }
}
