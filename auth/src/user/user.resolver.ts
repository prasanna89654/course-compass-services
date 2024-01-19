import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEmail } from './entities/user-email.entity';
import { VerifyEmailInput } from './dto/verify-email.input';
import { UserMobile } from './entities/user-mobile.entity';
import { AddMobileNumberInput } from './dto/add-mobile-number-input';
import { UserResponse } from './entities/user-response.entity';
import { CommonQuery, SortOrder } from 'src/interfaces/query.interface';
import { UpdateMobileNumberInput } from './dto/update-mobile-number-input';
import { Public } from 'src/auth/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/guards/role.guard';
import Roles from 'src/auth/entities/role.enum';
import { CreateUserDetails } from './dto/create-user-details.input';
import { UserDetail } from './entities/user-details.entity';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { VerifyMobileNumberInput } from './dto/verify-mobile-number.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Public()
  @Mutation(() => UserDetail)
  async createUserDetails(
    @Args('createUserDetails')
    createUserDetails: CreateUserDetails,
  ) {
    return this.userService.createUserDetails(createUserDetails);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Query(() => UserResponse, { name: 'users' })
  async findAll(
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

    return this.userService.findAll(query);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    // console.log(user);
    return this.userService.findOne(id);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => User)
  updateUser(
    @CurrentUser() user: JwtPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(
      updateUserInput.id,
      updateUserInput,
      user,
    );
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => User)
  removeUser(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.userService.remove(id, user);
  }

  @Public()
  @Mutation(() => UserEmail)
  async verifyEmail(
    @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput,
  ) {
    return this.userService.verifyEmail(verifyEmailInput);
  }

  @Public()
  @Mutation(() => UserMobile)
  async verifyMobileNumber(
    @Args('verifyMobileNumberInput') verifyMobileNumberInput: VerifyMobileNumberInput,
  ) {
    return this.userService.verifyMobileNumber(verifyMobileNumberInput);
  }

  @Public()
  @Mutation(() => UserMobile)
  async addMobileNumber(
    @Args('addMobileNumberInput') addMobileNumberInput: AddMobileNumberInput,
  ) {
    return this.userService.addMobileNumber(addMobileNumberInput);
  }

  @UseGuards(RoleGuard([Roles.SuperAdmin, Roles.Student]))
  @Mutation(() => UserMobile)
  async updateMobileNumber(
    @CurrentUser() user: JwtPayload,
    @Args('updateMobileNumberInput')
    updateMobileNumberInput: UpdateMobileNumberInput,
  ) {
    return this.userService.updateMobileNumber(updateMobileNumberInput, user);
  }
}
