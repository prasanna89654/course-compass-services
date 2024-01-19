import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Assignment } from '../entities/assignment.entity';

@ObjectType()
export class AssignmentResponse {
  @Field(() => Int, { description: "Total Assignment count" })
  totalCount: number;

  @Field(() => [Assignment], { description: "List of assignments" })
  assignments: Assignment[];
}