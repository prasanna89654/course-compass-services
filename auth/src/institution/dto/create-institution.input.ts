import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateInstitutionInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Name of institution.' })
  name: string;
}
