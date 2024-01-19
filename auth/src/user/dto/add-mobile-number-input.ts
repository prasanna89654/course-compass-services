import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class AddMobileNumberInput {
    @IsNotEmpty()
    @IsNumber()
    @Field(() => Int, { description: "User's Id" })
    userId: number;

    @IsNotEmpty()
    @IsString()
    @Field(() => String, { description: "User's mobile number" })
    mobile: string;
}