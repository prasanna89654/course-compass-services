import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class VerifyMobileNumberInput {
    @IsNotEmpty()
    @IsString()
    @Field(() => String, { description: "User's mobile number" })
    mobile: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => String, { description: "Verification code sent to mobile number" })
    verificationCode: string;
}
