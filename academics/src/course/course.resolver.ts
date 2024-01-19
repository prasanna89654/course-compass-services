import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CurrentUser } from 'src/middleware/common.middleware';
import { JwtPayload } from 'src/middleware/common.entity';
import { CourseResponse } from './dto/course.response';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  createCourse(
    @CurrentUser() user: JwtPayload,
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return this.courseService.create(user.userId, createCourseInput);
  }

  @Query(() => CourseResponse, { name: 'courses' })
  async findAll(
    @Args("skip", { nullable: true }) skip?: number,
    @Args("take", { nullable: true }) take?: number,
    @Args("orderBy", { nullable: true }) orderBy?: string,
    @Args("sortOrder", { nullable: true }) sortOrder?: SortOrder,
    @Args("search", { nullable: true }) search?: string,
  ) {
    const query: CommonQuery = {
      ...(search && { search }),
      skip: skip || 0,
      take: take || 25,
      orderBy: orderBy || "createdAt",
      sortOrder: sortOrder || SortOrder.DESC,
    };

    return this.courseService.findAll(query);
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseService.findOne(id);
  }

  @Mutation(() => Course)
  updateCourse(
    @CurrentUser() user: JwtPayload,
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.courseService.update(user, updateCourseInput);
  }

  @Mutation(() => Course)
  removeCourse(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number) {
    return this.courseService.remove(user, id);
  }
}
