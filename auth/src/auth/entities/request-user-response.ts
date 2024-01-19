import { Field, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class RequestUserResponse {

    @Field(() => Int, { description: "User's Id" })
    userId: number;

    @Field(() => String, { description: "User's role name" })
    role: string;
}