import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Institution {
  @Field(() => Int, { description: "Institution Id" })
  id: number;

  @Field(() => String, { description: "Institution Name" })
  name: string;

  @Field(() => Date, { description: "Institution created date" })
  createdAt: Date;

  @Field(() => Date, { description: "Institution updated date" })
  updatedAt: Date;
}
