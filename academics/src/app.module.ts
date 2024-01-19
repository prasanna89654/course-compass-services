import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { NoteModule } from './note/note.module';
import { SubAssignmentRemarkModule } from './sub-assignment-remark/sub-assignment-remark.module';
import { SubAssignmentModule } from './sub-assignment/sub-assignment.module';
import { AssignmentRemarkModule } from './assignment-remark/assignment-remark.module';
import { AssignmentModule } from './assignment/assignment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CourseModule,
    AssignmentModule,
    AssignmentRemarkModule,
    SubAssignmentModule,
    SubAssignmentRemarkModule,
    NoteModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
