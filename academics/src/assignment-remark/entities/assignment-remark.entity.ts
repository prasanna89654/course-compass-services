import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Assignment } from 'src/assignment/entities/assignment.entity';

@ObjectType()
export class AssignmentRemark {
  @Field(() => Int, { description: 'Assignment Remark Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => Int, { description: 'Assignment Id' })
  assignmentId: number;

  @Field(() => String, { description: 'Assignment Status' })
  status: string;

  @Field(() => String, { description: 'Assignment Remark' })
  remark: string;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;

  @Field(()=> Assignment, {description: 'Assignment'})
  assignment: Assignment;
}




