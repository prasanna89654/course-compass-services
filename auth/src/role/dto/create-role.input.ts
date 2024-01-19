import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Name of role.' })
  name: string;
}
