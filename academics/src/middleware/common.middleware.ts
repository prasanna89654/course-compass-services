import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { JwtPayload } from './common.entity';

export const CurrentUser = createParamDecorator( 
  async (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const bearerToken: String = ctx.getContext().req.headers
      .authorization as string;
    if (!bearerToken) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
    const token = bearerToken.split(' ')[1];
    const jwtService = new JwtService({ secret: process.env.SECRET_KEY });
    const user: JwtPayload = await jwtService.verify(token);
    return user;
  },
);
