import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserEmail {
  @Field(() => Int, { description: "User's email Id" })
  id: number;

  @Field(() => Int, { description: "User's Id" })
  userId: number;

  @Field(() => String, { description: "User's email address" })
  email: string;

  @Field(() => String, { description: "User's email verification code name", nullable: true, })
  verificationCode!: string;

  @Field(() => Date, { description: "User's email verified at date", nullable: true, })
  verifiedAt!: Date;

  @Field(() => Date, { description: "User's email created date" })
  createdAt: Date;

  @Field(() => Date, { description: "User's email updated date" })
  updatedAt: Date;
}
