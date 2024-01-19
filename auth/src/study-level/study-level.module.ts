import { Module } from '@nestjs/common';
import { StudyLevelService } from './study-level.service';
import { StudyLevelResolver } from './study-level.resolver';
import { PrismaModule } from '../../src/prisma/prisma.module';

@Module({
  providers: [StudyLevelResolver, StudyLevelService],
  imports: [PrismaModule],
})
export class StudyLevelModule {}
