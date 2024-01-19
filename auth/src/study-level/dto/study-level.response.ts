import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StudyLevel } from '@prisma/client';
import { StudyLevel as StudyLevelEntity } from '../entities/study-level.entity';

@ObjectType()
export class StudyLevelResponse {
  @Field(() => Int, { description: "Total study levels count" })
  totalCount: number;

  @Field(() => [StudyLevelEntity], { description: "List of study levels" })
  studyLevels: StudyLevel[];
}
