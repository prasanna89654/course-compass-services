import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateCourseInput } from './create-course.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Course Id' })
  id: number;
}
