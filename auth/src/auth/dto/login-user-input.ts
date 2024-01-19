import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginUserInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: "Username" })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Field({ description: "User's account password"})
  password: string;
}
