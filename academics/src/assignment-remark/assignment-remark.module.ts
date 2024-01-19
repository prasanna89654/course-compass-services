import { Module } from '@nestjs/common';
import { AssignmentRemarkService } from './assignment-remark.service';
import { AssignmentRemarkResolver } from './assignment-remark.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AssignmentRemarkResolver, AssignmentRemarkService],
  imports: [PrismaModule]
})
export class AssignmentRemarkModule {}
