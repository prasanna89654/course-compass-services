import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginUserResponse } from './entities/login-user-response';
import { LoginUserInput } from './dto/login-user-input';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { JwtPayload } from './entities/jwt-payload.entity';
import { RequestUserResponse } from './entities/request-user-response';

@Public()
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginUserResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => LoginUserResponse)
  async googleLogin(@Args('credentialToken') credentialToken: string) {
    return this.authService.googleLogin(credentialToken);
  }

  @Query(() => RequestUserResponse)
  getRequestUser(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
