import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubAssignment } from '../entities/sub-assignment.entity';

@ObjectType()
export class SubAssignmentResponse {
  @Field(() => Int, { description: "Total SubAssignment count" })
  totalCount: number;

  @Field(() => [SubAssignment], { description: "List of SubAssignments" })
  subAssignments: SubAssignment[];
}