import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentResolver } from './assignment.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AssignmentResolver, AssignmentService],
  imports: [PrismaModule]
})
export class AssignmentModule {}
