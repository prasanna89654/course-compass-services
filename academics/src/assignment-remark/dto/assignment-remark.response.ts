import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AssignmentRemark } from '../entities/assignment-remark.entity';

@ObjectType()
export class AssignmentRemarkResponse {
  @Field(() => Int, { description: "Total Assignment Remark count" })
  totalCount: number;

  @Field(() => [AssignmentRemark], { description: "List of Assignment Remarks" })
  assignmentRemarks: AssignmentRemark[];
}