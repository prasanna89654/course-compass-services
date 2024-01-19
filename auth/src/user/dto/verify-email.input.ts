import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class VerifyEmailInput {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Field(() => String, { description: "User's email address" })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => String, { description: "Verification code sent to email" })
    verificationCode: string;
}
