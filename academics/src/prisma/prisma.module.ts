import { Module } from '@nestjs/common';
import { AcademicsPrismaService } from './prisma.service';

@Module({
  providers: [AcademicsPrismaService],
  exports: [AcademicsPrismaService],
})
export class PrismaModule {}
