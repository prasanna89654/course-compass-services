import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Role as RoleEntity } from '../entities/role.entity';

@ObjectType()
export class RoleResponse {
  @Field(() => Int, { description: "Total Roles Count" })
  totalCount: number;

  @Field(() => [RoleEntity], { description: "List of roles" })
  roles: Role[];
}
