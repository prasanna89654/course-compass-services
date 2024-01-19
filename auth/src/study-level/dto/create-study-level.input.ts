import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateStudyLevelInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Name of study level.' })
  name: string;
}
