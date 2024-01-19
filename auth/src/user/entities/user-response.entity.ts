import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User as UserEntity } from './user.entity';
import { User } from '@prisma/client';

@ObjectType()
export class UserResponse {
  @Field(() => Int, { description: 'Total User count' })
  totalCount: number;

  @Field(() => [UserEntity], { description: 'List of institutions' })
  users: User[];
}
