import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AssignmentRemark } from 'src/assignment-remark/entities/assignment-remark.entity';
import { Course } from 'src/course/entities/course.entity';
import { SubAssignment } from 'src/sub-assignment/entities/sub-assignment.entity';

@ObjectType()
export class Assignment {
  @Field(() => Int, { description: 'Assignment Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => Int, { description: 'Course Id' })
  courseId: number;

  @Field(() => String, { description: 'Assignment name' })
  name: string;

  @Field(() => String, {
    description: 'Assignment Description',
    nullable: true,
  })
  description?: string;

  @Field(() => String, { description: 'Assignment Link', nullable: true })
  link?: string;

  @Field(() => String, { description: 'Assignment File Path', nullable: true })
  file_path?: string;

  @Field(() => String, { description: 'Assignment Start Date' })
  startDate: string;

  @Field(() => String, { description: 'Assignment End Date' })
  endDate: string;

  @Field(() => String, { description: 'Assignment Priority' })
  priority: string;

  @Field(() => String, { description: 'Assignment Status' })
  status: string;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;

  @Field(() => [AssignmentRemark], { description: 'Assignment Remarks' })
  assignmentRemarks: AssignmentRemark[];

  @Field(() => [SubAssignment], { description: 'Sub Assignments' })
  subAssignments: SubAssignment[];

  @Field(() => Course, { description: 'Course' })
  course: Course;
}
