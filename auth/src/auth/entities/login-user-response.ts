import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginUserResponse {
  @Field(() => Int, { description: "User's Id" })
  userId: number;

  @Field(() => String, { description: "User's access Token" })
  accessToken: string;

  @Field(() => Int, { description: "User's access Token expiry in days" })
  expiresInDays: number;

  @Field(() => String, { description: "User's role name" })
  role: string;

  @Field(() => Boolean, { description: "User's onboarding status" })
  onBoardingCompleted: boolean;

  @Field(() => Boolean, { description: "User's google sign in status" })
  signInByGoogle: boolean;

}
