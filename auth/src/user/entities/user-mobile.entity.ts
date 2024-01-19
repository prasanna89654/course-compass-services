import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserMobile {
  @Field(() => Int, { description: "User's mobile number Id" })
  id: number;

  @Field(() => Int, { description: "User's Id" })
  userId: number;

  @Field(() => String, { description: "User's mobie number" })
  mobile: string;

  @Field(() => String, { description: "User's mobile number verification code name", nullable: true, })
  verificationCode!: string;

  @Field(() => Date, { description: "User's mobile number verified at date", nullable: true, })
  verifiedAt!: Date;

  @Field(() => Date, { description: "User's mobile number created date" })
  createdAt: Date;

  @Field(() => Date, { description: "User's mobile number updated date" })
  updatedAt: Date;
}
