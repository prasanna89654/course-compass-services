import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Role Id' })
  roleId: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @IsOptional()
  @IsString()
  @Field({ description: "User's middle name", nullable: true })
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String, { description: "User's email address" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Field({ description: "User's account password", nullable: true })
  password?: string;
}
