import { Module } from '@nestjs/common';
import { SubAssignmentRemarkService } from './sub-assignment-remark.service';
import { SubAssignmentRemarkResolver } from './sub-assignment-remark.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SubAssignmentRemarkResolver, SubAssignmentRemarkService],
  imports: [PrismaModule]
})
export class SubAssignmentRemarkModule {}
