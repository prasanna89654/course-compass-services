import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Assignment } from 'src/assignment/entities/assignment.entity';

@ObjectType()
export class Course {
  @Field(() => Int, { description: 'Course Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => String, { description: 'Course name' })
  name: string;

  @Field(() => String, { description: 'Semester', nullable: true })
  semester?: string;

  @Field(() => String, { description: 'Year', nullable: true })
  year?: string;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;

  @Field(() => [Assignment], { description: 'Assignments' })
  assignments: Assignment[];
}
