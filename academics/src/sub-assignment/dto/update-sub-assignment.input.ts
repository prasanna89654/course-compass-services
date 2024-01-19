import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateSubAssignmentInput } from './create-sub-assignment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubAssignmentInput extends PartialType(CreateSubAssignmentInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'SubAssignment Id' })
  id: number;
}
