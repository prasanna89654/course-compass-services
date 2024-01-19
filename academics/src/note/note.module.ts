import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteResolver } from './note.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [NoteResolver, NoteService],
  imports: [PrismaModule]
})
export class NoteModule {}
