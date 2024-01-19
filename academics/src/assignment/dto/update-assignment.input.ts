import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateAssignmentInput } from './create-assignment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentInput extends PartialType(CreateAssignmentInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Assignment Id' })
  id: number;
}
