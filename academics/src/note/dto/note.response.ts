import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Note } from '../entities/note.entity';

@ObjectType()
export class NoteResponse {
  @Field(() => Int, { description: 'Total Note count' })
  totalCount: number;

  @Field(() => [Note], { description: 'List of Notes' })
  notes: Note[];
}
