import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StudyLevel {
  @Field(() => Int, { description: "Study level Id" })
  id: number;

  @Field(() => String, { description: "Study level Name" })
  name: string;

  @Field(() => Date, { description: "Study level created date" })
  createdAt: Date;

  @Field(() => Date, { description: "Study level updated date" })
  updatedAt: Date;
}
