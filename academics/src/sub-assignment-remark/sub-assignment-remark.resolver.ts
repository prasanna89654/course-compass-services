import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubAssignmentRemarkService } from './sub-assignment-remark.service';
import { SubAssignmentRemark } from './entities/sub-assignment-remark.entity';
import { CreateSubAssignmentRemarkInput } from './dto/create-sub-assignment-remark.input';
import { UpdateSubAssignmentRemarkInput } from './dto/update-sub-assignment-remark.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';
import { SubAssignmentRemarkResponse } from './dto/sub-assignment-remark.response';

@Resolver(() => SubAssignmentRemark)
export class SubAssignmentRemarkResolver {
  constructor(
    private readonly subAssignmentRemarkService: SubAssignmentRemarkService,
  ) {}

  @Mutation(() => SubAssignmentRemark)
  createSubAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('createSubAssignmentRemarkInput')
    createSubAssignmentRemarkInput: CreateSubAssignmentRemarkInput,
  ) {
    return this.subAssignmentRemarkService.create(
      user.userId,
      createSubAssignmentRemarkInput,
    );
  }

  @Query(() => SubAssignmentRemarkResponse, { name: 'subAssignmentRemarks' })
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
    return this.subAssignmentRemarkService.findAll(query);
  }

  @Query(() => SubAssignmentRemark, { name: 'subAssignmentRemark' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subAssignmentRemarkService.findOne(id);
  }

  @Mutation(() => SubAssignmentRemark)
  updateSubAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('updateSubAssignmentRemarkInput')
    updateSubAssignmentRemarkInput: UpdateSubAssignmentRemarkInput,
  ) {
    return this.subAssignmentRemarkService.update(
      user,
      updateSubAssignmentRemarkInput,
    );
  }

  @Mutation(() => SubAssignmentRemark)
  removeSubAssignmentRemark(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.subAssignmentRemarkService.remove(user, id);
  }
}
