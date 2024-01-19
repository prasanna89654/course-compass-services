import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateNoteInput } from './create-note.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { description: 'Note Id' })
  id: number;
}
