import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateAssignmentRemarkInput } from './create-assignment-remark.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentRemarkInput extends PartialType(CreateAssignmentRemarkInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'AssignmentRemark Id' })
  id: number;
}
