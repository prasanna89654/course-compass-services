import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../../../src/role/entities/role.entity';
import { UserEmail } from './user-email.entity';
import { UserMobile } from './user-mobile.entity';

@ObjectType()
export class  User {
  @Field(() => Int, { description: "User Id" })
  id: number;

  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field({ description: "User's middle name", nullable: true })
  middleName!: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => Boolean, { description: "Flag to check user's onboarding status" })
  onBoardingCompleted: boolean;

  @Field(() => Boolean, { description: "Flag to check user's aignin status" })
  signInByGoogle: boolean;

  @Field(() => String, { description: "Flag to check user's account status" })
  accountStatus: string;

  @Field(() => Date, { description: "User created date" })
  createdAt: Date;

  @Field(() => Date, { description: "User updated date" })
  updatedAt: Date;

  @Field(() => Role, { description: "User's role" })
  role: Role;

  @Field(() => UserEmail, { description: "User's email detail" })
  userEmail: UserEmail;

  @Field(() => UserMobile, { description: "User's mobile number detail", nullable: true })
  userMobile?: UserMobile;
}
