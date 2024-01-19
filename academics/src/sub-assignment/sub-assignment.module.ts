import { Module } from '@nestjs/common';
import { SubAssignmentService } from './sub-assignment.service';
import { SubAssignmentResolver } from './sub-assignment.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SubAssignmentResolver, SubAssignmentService],
  imports: [PrismaModule]
})
export class SubAssignmentModule {}
