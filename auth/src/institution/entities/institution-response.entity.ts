import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Institution } from '@prisma/client';
import { Institution as InstitutionEntity } from './institution.entity';

@ObjectType()
export class InstitutionResponse {
  @Field(() => Int, { description: "Total institutions count" })
  totalCount: number;

  @Field(() => [InstitutionEntity], { description: "List of institutions" })
  institutions: Institution[];
}
