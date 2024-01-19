import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user-input';
import { LoginUserResponse } from './entities/login-user-response';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);


@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserInput: LoginUserInput): Promise<LoginUserResponse> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            userEmail: {
              email: loginUserInput.username,
            },
          },
          {
            userMobile: {
              mobile: loginUserInput.username,
            },
          },
        ],
      },
      include: {
        role: true,

      },
    });

    if (!user) {
      throw new GraphQLError('Invalid username or password', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new GraphQLError('Invalid username or password', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const generatedToken = this.jwtService.sign({
      userId: user.id,
      role: user.role.name,
    });

    const loginUserResponse : LoginUserResponse = {
      userId: user.id,
      accessToken: generatedToken,
      expiresInDays: 15,
      role: user.role.name,
      onBoardingCompleted: user.onBoardingCompleted,
      signInByGoogle: user.signInByGoogle,
    };

    return loginUserResponse;
  }

  async googleLogin(googleCredentialToken: string): Promise<LoginUserResponse> {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleCredentialToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    const user = await this.prismaService.user.findFirst({
      where: {
        userEmail: {
          email,
        },
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      const user = await this.prismaService.user.create({
        data: {
          userEmail: {
            create: {
              email,
              verificationCode: null,
            },
          },
          role: {
            connect: {
              id: 2,
            },
          },
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1],
          password: await bcrypt.hash(process.env.SECRET_KEY, 10),
          signInByGoogle: true,
        },
        include: {
          role: true,
        },
      });
      const generatedToken = this.jwtService.sign({
        userId: user.id,
        role: user.role.name,
      });

      return {
        userId: user.id,
        accessToken: generatedToken,
        expiresInDays: 15,
        role: user.role.name,
        onBoardingCompleted: user.onBoardingCompleted,
        signInByGoogle: user.signInByGoogle,
      };
    } else {
      const generatedToken = this.jwtService.sign({
        userId: user.id,
        role: user.role.name,
      });

      return {
        userId: user.id,
        accessToken: generatedToken,
        expiresInDays: 15,
        role: user.role.name,
        onBoardingCompleted: user.onBoardingCompleted,
        signInByGoogle: user.signInByGoogle,
      };
    }
  }
  

 
 
}
