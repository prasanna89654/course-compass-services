import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum SubAssignmentRemarkStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  review = 'review',
  complete = 'complete',
}

registerEnumType(SubAssignmentRemarkStatus, {
  name: 'SubAssignmentRemarkStatus',
});

@InputType()
export class CreateSubAssignmentRemarkInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'SubAssignment Id' })
  subAssignmentId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => SubAssignmentRemarkStatus, {
    description: 'SubAssignment Status',
  })
  status: SubAssignmentRemarkStatus;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'SubAssignment Remark' })
  remark: string;
}
