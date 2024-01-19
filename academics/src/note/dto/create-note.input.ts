import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Note name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Note Description' })
  description: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'Note Link', nullable: true })
  link?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean, { description: 'Note Shareable' })
  isShareable: boolean;
}
