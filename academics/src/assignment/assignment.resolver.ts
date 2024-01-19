import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AssignmentService } from './assignment.service';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { AssignmentResponse } from './dto/assignment.response';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';

@Resolver(() => Assignment)
export class AssignmentResolver {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Mutation(() => Assignment)
  createAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('createAssignmentInput') createAssignmentInput: CreateAssignmentInput,
  ) {
    return this.assignmentService.create(user.userId, createAssignmentInput);
  }

  @Query(() => AssignmentResponse, { name: 'assignments' })
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
    return this.assignmentService.findAll(query);
  }

  @Query(() => Assignment, { name: 'assignment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.assignmentService.findOne(id);
  }

  @Mutation(() => Assignment)
  updateAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('updateAssignmentInput') updateAssignmentInput: UpdateAssignmentInput,
  ) {
    return this.assignmentService.update(user, updateAssignmentInput);
  }

  @Mutation(() => Assignment)
  removeAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.assignmentService.remove(user, id);
  }
}
