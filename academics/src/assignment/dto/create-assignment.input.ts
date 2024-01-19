import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AssignmentPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum AssignmentStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  review = 'review',
  complete = 'complete',
}

registerEnumType(AssignmentPriority, {
  name: 'AssignmentPriority',
});

registerEnumType(AssignmentStatus, {
  name: 'AssignmentStatus',
});

@InputType()
export class CreateAssignmentInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Course Id' })
  courseId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Assignment name' })
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, {
    description: 'Assignment Description',
    nullable: true,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'Assignment Link', nullable: true })
  link?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'Assignment File Path', nullable: true })
  file_path?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Assignment Start Date' })
  startDate: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Assignment End Date' })
  endDate: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => AssignmentPriority, { description: 'Assignment Priority' })
  priority: AssignmentPriority;

  @IsNotEmpty()
  @IsString()
  @Field(() => AssignmentStatus, { description: 'Assignment Status' })
  status: AssignmentStatus;
}
