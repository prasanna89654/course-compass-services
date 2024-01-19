import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AssignmentRemarkService } from './assignment-remark.service';
import { AssignmentRemark } from './entities/assignment-remark.entity';
import { CreateAssignmentRemarkInput } from './dto/create-assignment-remark.input';
import { UpdateAssignmentRemarkInput } from './dto/update-assignment-remark.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';
import { AssignmentRemarkResponse } from './dto/assignment-remark.response';

@Resolver(() => AssignmentRemark)
export class AssignmentRemarkResolver {
  constructor(
    private readonly assignmentRemarkService: AssignmentRemarkService,
  ) {}

  @Mutation(() => AssignmentRemark)
  createAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('createAssignmentRemarkInput')
    createAssignmentRemarkInput: CreateAssignmentRemarkInput,
  ) {
    return this.assignmentRemarkService.create(
      user.userId,
      createAssignmentRemarkInput,
    );
  }

  @Query(() => AssignmentRemarkResponse, { name: 'assignmentRemark' })
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
    return this.assignmentRemarkService.findAll(query);
  }

  @Query(() => AssignmentRemark, { name: 'assignmentRemark' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.assignmentRemarkService.findOne(id);
  }

  @Mutation(() => AssignmentRemark)
  updateAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('updateAssignmentRemarkInput')
    updateAssignmentRemarkInput: UpdateAssignmentRemarkInput,
  ) {
    return this.assignmentRemarkService.update(
      user,
      updateAssignmentRemarkInput,
    );
  }

  @Mutation(() => AssignmentRemark)
  removeAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.assignmentRemarkService.remove(user, id);
  }
}
