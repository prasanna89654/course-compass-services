import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubAssignmentRemark } from 'src/sub-assignment-remark/entities/sub-assignment-remark.entity';

@ObjectType()
export class SubAssignment {
  @Field(() => Int, { description: 'Sub Assignment Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => Int, { description: 'Assignment Id' })
  assignmentId: number;

  @Field(() => String, { description: 'Sub Assignment name' })
  name: string;

  @Field(() => String, {
    description: 'Sub Assignment Description',
    nullable: true,
  })
  description?: string;

  @Field(() => String, { description: 'Sub Assignment Start Date' })
  startDate: string;

  @Field(() => String, { description: 'Sub Assignment End Date' })
  endDate: string;

  @Field(() => String, { description: 'Sub Assignment Status' })
  status: string;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;

  @Field(() => [SubAssignmentRemark], { description: 'Sub Assignment Remarks' })
  subAssignmentRemarks: SubAssignmentRemark[];
}
