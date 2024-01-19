import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

export enum Semester {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
  fifth = 'fifth',
  sixth = 'sixth',
  seventh = 'seventh',
  eighth = 'eighth',
  ninth = 'ninth',
  tenth = 'tenth',
}

export enum Year {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
  fifth = 'fifth',
}

registerEnumType(Semester, {
  name: 'Semester',
});

registerEnumType(Year, {
  name: 'Year',
});

@InputType()
export class CreateCourseInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Course name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => Semester, { description: 'Semester', nullable: true })
  semester?: Semester;

  @IsNotEmpty()
  @IsString()
  @Field(() => Year, { description: 'Year', nullable: true })
  year?: Year;
}
