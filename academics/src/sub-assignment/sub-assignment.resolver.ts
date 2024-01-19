import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubAssignmentService } from './sub-assignment.service';
import { SubAssignment } from './entities/sub-assignment.entity';
import { CreateSubAssignmentInput } from './dto/create-sub-assignment.input';
import { UpdateSubAssignmentInput } from './dto/update-sub-assignment.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { SubAssignmentResponse } from './dto/sub-assignment.response';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';

@Resolver(() => SubAssignment)
export class SubAssignmentResolver {
  constructor(private readonly subAssignmentService: SubAssignmentService) {}

  @Mutation(() => SubAssignment)
  createSubAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('createSubAssignmentInput')
    createSubAssignmentInput: CreateSubAssignmentInput,
  ) {
    return this.subAssignmentService.create(
      user.userId,
      createSubAssignmentInput,
    );
  }

  @Query(() => SubAssignmentResponse, { name: 'subAssignments' })
  findAll(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
    @Args('orderBy', { nullable: true }) orderBy?: string,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder,
    @Args('search', { nullable: true }) search?: string,
  ) {
    const query: CommonQuery = {
      ...(search && { search }),
      skip: skip || 0,
      take: take || 25,
      orderBy: orderBy || 'createdAt',
      sortOrder: sortOrder || SortOrder.DESC,
    };

    return this.subAssignmentService.findAll(query);
  }

  @Query(() => SubAssignment, { name: 'subAssignment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subAssignmentService.findOne(id);
  }

  @Mutation(() => SubAssignment)
  updateSubAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('updateSubAssignmentInput')
    updateSubAssignmentInput: UpdateSubAssignmentInput,
  ) {
    return this.subAssignmentService.update(user, updateSubAssignmentInput);
  }

  @Mutation(() => SubAssignment)
  removeSubAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.subAssignmentService.remove(user, id);
  }
}
