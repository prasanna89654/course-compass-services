import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum RemarkStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  review = 'review',
  complete = 'complete',
}

registerEnumType(RemarkStatus, {
  name: 'RemarkStatus',
});

@InputType()
export class CreateAssignmentRemarkInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Assignment Id' })
  assignmentId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => RemarkStatus, { description: 'Assignment Status' })
  status: RemarkStatus;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Assignment Remark' })
  remark: string;
}
