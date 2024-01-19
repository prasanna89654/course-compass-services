import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { UserProcessor } from './user.processor';
import { RoleService } from '../../src/role/role.service';

@Module({
  providers: [UserResolver, UserService, UserProcessor, RoleService],
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
})
export class UserModule {}
