import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SubAssignmentRemark {
  @Field(() => Int, { description: 'Sub Assignment Remark Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => Int, { description: 'Sub Assignment Id' })
  subAssignmentId: number;

  @Field(() => String, { description: 'Sub Assignment Status' })
  status: string;

  @Field(() => String, { description: 'Sub Assignment Remark' })
  remark: string;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;
}
