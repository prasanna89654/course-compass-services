import Role from '../entities/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AccessTokenGuard } from './accessToken.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../entities/jwt-payload.entity';

const RoleGuard = (role: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends AccessTokenGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const ctx = GqlExecutionContext.create(context);
      const bearerToken: String = ctx.getContext().req.headers
        .authorization as string;
      if (!bearerToken) return false;
      const token = bearerToken.split(' ')[1];
      const jwtService = new JwtService({ secret: process.env.SECRET_KEY });
      const user: JwtPayload = await jwtService.verify(token);
      return role.includes(user.role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
