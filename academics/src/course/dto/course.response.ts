import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Course } from '../entities/course.entity';

@ObjectType()
export class CourseResponse {
  @Field(() => Int, { description: "Total course count" })
  totalCount: number;

  @Field(() => [Course], { description: "List of courses" })
  courses: Course[];
}
