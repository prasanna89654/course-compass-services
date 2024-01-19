import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Note {
  @Field(() => Int, { description: 'Note Id' })
  id: number;

  @Field(() => Int, { description: 'User Id' })
  userId: number;

  @Field(() => String, { description: 'Note name' })
  name: string;

  @Field(() => String, { description: 'Note Description' })
  description: string;

  @Field(() => String, { description: 'Note Link', nullable: true })
  link?: string;

  @Field(() => Boolean, { description: 'Note isShareable' })
  isShareable: boolean;

  @Field(() => String, { description: 'Created At' })
  createdAt: string;

  @Field(() => String, { description: 'Updated At' })
  updatedAt: string;
}
