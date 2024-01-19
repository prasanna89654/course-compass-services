import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateSubAssignmentRemarkInput } from './create-sub-assignment-remark.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubAssignmentRemarkInput extends PartialType(CreateSubAssignmentRemarkInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'SubAssignmentRemark Id' })
  id: number;
}
