import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubAssignmentRemark } from '../entities/sub-assignment-remark.entity';

@ObjectType()
export class SubAssignmentRemarkResponse {
  @Field(() => Int, { description: 'Total Sub Assignment Remark count' })
  totalCount: number;

  @Field(() => [SubAssignmentRemark], {
    description: 'List of Sub Assignment Remarks',
  })
  subAssignmentRemarks: SubAssignmentRemark[];
}
