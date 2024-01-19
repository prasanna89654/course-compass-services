import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AcademicsType } from '@prisma/client';

@InputType()
export class CreateUserDetails {
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { description: "Study Level Id" , nullable: true})
  studyLevelId: number;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { description: "Institution Id" , nullable: true})
  institutionId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: "Student Academic Type"})
  academicsType: AcademicsType;
}
