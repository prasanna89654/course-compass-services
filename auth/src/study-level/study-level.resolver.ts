import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudyLevelService } from './study-level.service';
import { StudyLevel } from './entities/study-level.entity';
import { CreateStudyLevelInput } from './dto/create-study-level.input';
import { UpdateStudyLevelInput } from './dto/update-study-level.input';
import { StudyLevelResponse } from './dto/study-level.response';
import { CommonQuery, SortOrder } from '../../src/interfaces/query.interface';
import { Public } from 'src/auth/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/guards/role.guard';
import Roles from 'src/auth/entities/role.enum';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';

@Resolver(() => StudyLevel)
export class StudyLevelResolver {
  constructor(private readonly studyLevelService: StudyLevelService) {}

  @Public()
  @Mutation(() => StudyLevel)
  async createStudyLevel(@Args('createStudyLevelInput') createStudyLevelInput: CreateStudyLevelInput) {
    return this.studyLevelService.create(createStudyLevelInput);
  }

  @Public()
  @Query(() => StudyLevelResponse, { name: 'studyLevels' })
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

    return this.studyLevelService.findAll(query);
  }


  @Public()
  @Query(() => StudyLevel, { name: 'studyLevel' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.studyLevelService.findOne(id);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => StudyLevel)
  async updateStudyLevel(
      @CurrentUser() user: JwtPayload,
    @Args('updateStudyLevelInput') updateStudyLevelInput: UpdateStudyLevelInput) {
    return this.studyLevelService.update(updateStudyLevelInput.id, updateStudyLevelInput, user);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => StudyLevel)
  async removeStudyLevel(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number) {
    return this.studyLevelService.remove(id, user);
  }
}
