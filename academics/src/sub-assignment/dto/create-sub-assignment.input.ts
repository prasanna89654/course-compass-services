import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import {
  IS_ALPHA,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SubAssignmentStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  review = 'review',
  complete = 'complete',
}

registerEnumType(SubAssignmentStatus, {
  name: 'SubAssignmentStatus',
});

@InputType()
export class CreateSubAssignmentInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Assignment Id' })
  assignmentId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'SubAssignment name' })
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, {
    description: 'SubAssignment Description',
    nullable: true,
  })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'SubAssignment Start Date' })
  startDate: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'SubAssignment End Date' })
  endDate: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => SubAssignmentStatus, { description: 'SubAssignment Status' })
  status: SubAssignmentStatus;
}
