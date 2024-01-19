import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NoteService } from './note.service';
import { Note } from './entities/note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';
import { NoteResponse } from './dto/note.response';

@Resolver(() => Note)
export class NoteResolver {
  constructor(private readonly noteService: NoteService) {}

  @Mutation(() => Note)
  createNote(
    @CurrentUser() user: JwtPayload,
    @Args('createNoteInput') createNoteInput: CreateNoteInput,
  ) {
    return this.noteService.create(user.userId, createNoteInput);
  }

  @Query(() => NoteResponse, { name: 'notes' })
  findAll(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
    @Args('orderBy', { nullable: true }) orderBy?: string,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder,
    @Args('search', { nullable: true }) search?: string,
  ) {
    const query: CommonQuery = {
      ...(search && { search }),
      skip: skip || 0,
      take: take || 25,
      orderBy: orderBy || 'createdAt',
      sortOrder: sortOrder || SortOrder.DESC,
    };
    return this.noteService.findAll(query);
  }

  @Query(() => Note, { name: 'note' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.noteService.findOne(id);
  }

  @Mutation(() => Note)
  updateNote(
    @CurrentUser() user: JwtPayload,
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
  ) {
    return this.noteService.update(user, updateNoteInput);
  }

  @Mutation(() => Note)
  removeNote(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.noteService.remove(user, id);
  }
}
