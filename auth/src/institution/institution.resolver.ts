import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InstitutionService } from './institution.service';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { InstitutionResponse } from './entities/institution-response.entity';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';
import { UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/guards/role.guard';
import Roles from 'src/auth/entities/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';

@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Public()
  @Mutation(() => Institution)
  async createInstitution(@Args('createInstitutionInput') createInstitutionInput: CreateInstitutionInput) {
    return this.institutionService.create(createInstitutionInput);
  }

  @Public()
  @Query(() => InstitutionResponse, { name: 'institutions' })
  async findAll(
    @Args("skip", { nullable: true }) skip?: number,
    @Args("take", { nullable: true }) take?: number,
    @Args("orderBy", { nullable: true }) orderBy?: string,
    @Args("sortOrder", { nullable: true }) sortOrder?: SortOrder,
    @Args("search", { nullable: true }) search?: string,
  ) {
    const query: CommonQuery = {
      ...(search && { search }),
      skip: skip || 0,
      take: take || 25,
      orderBy: orderBy || "createdAt",
      sortOrder: sortOrder || SortOrder.DESC,
    };

    return this.institutionService.findAll(query);
  }

  @Public()
  @Query(() => Institution, { name: 'institution' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.institutionService.findOne(id);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => Institution)
  async updateInstitution(
    @CurrentUser() user: JwtPayload,
    @Args('updateInstitutionInput') updateInstitutionInput: UpdateInstitutionInput) {
    return this.institutionService.update(updateInstitutionInput.id, updateInstitutionInput, user);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => Institution)
  async removeInstitution(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number) {
    return this.institutionService.remove(id, user);
  }
}
