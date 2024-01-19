import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CourseResolver, CourseService],
  imports: [PrismaModule],
})
export class CourseModule {}
