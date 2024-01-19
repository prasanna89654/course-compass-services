import { CreateStudyLevelInput } from './create-study-level.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStudyLevelInput extends PartialType(CreateStudyLevelInput) {
  @Field(() => Int, { description: "Study Level Id." })
  id: number;
}
