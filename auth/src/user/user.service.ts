import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Mail } from '../../src/interfaces/queue.interface';
import { RoleService } from '../../src/role/role.service';
import { VerifyEmailInput } from './dto/verify-email.input';
import { UserEmail } from './entities/user-email.entity';
import { User } from './entities/user.entity';
import { AddMobileNumberInput } from './dto/add-mobile-number-input';
import { UserMobile } from './entities/user-mobile.entity';
import { VerifyMobileNumberInput } from './dto/verify-mobile-number.input';
import { CommonQuery } from '../../src/interfaces/query.interface';
import { UserResponse } from './entities/user-response.entity';
import { UpdateMobileNumberInput } from './dto/update-mobile-number-input';
import { CreateUserDetails } from './dto/create-user-details.input';
import { JwtPayload } from '../../src/auth/entities/jwt-payload.entity';
import Roles from '../../src/auth/entities/role.enum';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectQueue('user') private readonly userQueue: Queue,
    private readonly prismaService: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    // make sure role exists
    await this.roleService.findOne(createUserInput.roleId);

    // make sure that email has not already been taken
    await this.checkIfEmailExistsForCreate(createUserInput.email);

    const verificationCode: string = await this.generateVerificationCode(
      'email',
    );

    const { email, password, ...remaining } = createUserInput;

    const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = await this.prismaService.user.create({
      data: {
        ...remaining,
        password: hashedPassword,
        userEmail: {
          create: {
            email,
            verificationCode,
          },
        },
      },
      include: {
        role: true,
        userEmail: true,
      },
    });

    await this.sendVerificationMail({
      from: process.env.ACCOUNT_EMAIL,
      to: user.userEmail.email,
      otp: verificationCode,
    });

    return user;
  }

  async createUserDetails(createUserDetails: CreateUserDetails) {
    const { userId, studyLevelId, institutionId } = createUserDetails;
    await this.findOrFailUser(userId);
    await this.findOrFailStudyLevel(studyLevelId);
    await this.findOrFailInstitution(institutionId);
    const userDetail = await this.prismaService.userDetail.create({
      data: createUserDetails,
    });
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        onBoardingCompleted: true,
      },
    });
    return userDetail;
  }

  async findAll(query: CommonQuery): Promise<UserResponse> {
    let whereClause: { AND?: object[] } = {};

    if (query.search) {
      whereClause.AND = [
        {
          OR: [
            { firstName: { contains: query.search.toString() } },
            { lastName: { contains: query.search.toString() } },
            {
              userEmail: {
                OR: [{ email: { contains: query.search.toString() } }],
              },
            },
            {
              userMobile: {
                OR: [{ mobile: { contains: query.search.toString() } }],
              },
            },
          ],
        },
      ];
    }

    const totalCount: number = await this.prismaService.user.count({
      where: whereClause,
    });

    const users = await this.prismaService.user.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: {
        [query.orderBy]: query.sortOrder,
      },
      include: {
        role: true,
        userEmail: true,
        userMobile: true,
      },
    });

    return { totalCount, users };
  }

  async findOne(id: number) {
    await this.findOrFailUser(id);
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        role: true,
        userEmail: true,
        userMobile: true,
      },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput, user: JwtPayload) {
    let hashedPassword: string = null;
    await this.findOrFailUser(id);

    if (updateUserInput.email !== undefined) {
      await this.checkIfEmailExistsForUpdate(updateUserInput.email, id);

      const emailVerificationCode: string = await this.generateVerificationCode(
        'email',
      );

      await this.prismaService.userEmail.update({
        where: { userId: id },
        data: {
          email: updateUserInput.email,
          verificationCode: emailVerificationCode,
          verifiedAt: null,
        },
      });
      await this.sendVerificationMail({
        from: process.env.ACCOUNT_EMAIL,
        to: updateUserInput.email,
        otp: emailVerificationCode,
      });
    }

    await this.checkIfUserCan(id, user.userId, user.role);

    const { email, password, ...remaining } = updateUserInput;

    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(updateUserInput.password, SALT_ROUNDS);
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...remaining,
        password: hashedPassword,
      },
    });
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOrFailUser(id);
    await this.checkIfUserCan(id, user.userId, user.role);
    return this.prismaService.user.delete({ where: { id } });
  }

  async verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<UserEmail> {
    const { email, verificationCode } = verifyEmailInput;
    /**
     * We need to check whether the verification code exists or not
     * Also, the entered code is for the correct email address.
     */
    await this.checkIfVerificationCodeExistsForAnEmail(email, verificationCode);

    /**
     * To verify email address, set verification code to null
     * And add current date to the verifiedAt column.
     */
    return this.prismaService.userEmail.update({
      where: {
        email,
        verificationCode,
      },
      data: {
        verificationCode: null,
        verifiedAt: new Date(),
      },
    });
  }

  async addMobileNumber(
    addMobileNumberInput: AddMobileNumberInput,
  ): Promise<UserMobile> {
    // First check if User with id exists
    await this.findOrFailUser(addMobileNumberInput.userId);

    // Then check if the mobile number is allowed to be udpated
    await this.checkIfMobileNumberExistsForCreate(addMobileNumberInput.mobile);

    const verificationCode: string = await this.generateVerificationCode(
      'mobile',
    );

    const userMobile = await this.prismaService.userMobile.create({
      data: {
        ...addMobileNumberInput,
        verificationCode,
      },
    });

    await this.sendVerificationOtp(verificationCode);
    return userMobile;
  }

  async updateMobileNumber(
    updateMobileNumberInput: UpdateMobileNumberInput,
    user: JwtPayload,
  ): Promise<UserMobile> {
    await this.findOrFailUser(updateMobileNumberInput.userId);
    await this.checkIfMobileNumberExistsForUpdate(
      updateMobileNumberInput.mobile,
      updateMobileNumberInput.userId,
    );
    await this.checkIfUserCan(
      updateMobileNumberInput.userId,
      user.userId,
      user.role,
    );
    const verificationCode: string = await this.generateVerificationCode(
      'mobile',
    );
    const userMobile = await this.prismaService.userMobile.update({
      where: { userId: updateMobileNumberInput.userId },
      data: {
        mobile: updateMobileNumberInput.mobile,
        verificationCode: verificationCode,
        verifiedAt: null,
      },
    });
    await this.sendVerificationOtp(verificationCode);
    return userMobile;
  }

  async verifyMobileNumber(
    verifyMobileNumberInput: VerifyMobileNumberInput,
  ): Promise<UserMobile> {
    const { mobile, verificationCode } = verifyMobileNumberInput;

    await this.checkIfVerificationCodeExistsForMobileNumber(
      mobile,
      verificationCode,
    );

    return this.prismaService.userMobile.update({
      where: {
        mobile,
        verificationCode,
      },
      data: {
        verificationCode: null,
        verifiedAt: new Date(),
      },
    });
  }

  private async checkIfEmailExistsForCreate(email: string) {
    const userEmail = await this.prismaService.userEmail.findUnique({
      where: { email },
    });

    if (userEmail) {
      throw new GraphQLError('Email has already been taken', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfMobileNumberExistsForCreate(mobile: string) {
    const userMobile = await this.prismaService.userMobile.findUnique({
      where: { mobile },
    });

    if (userMobile) {
      throw new GraphQLError('This mobile number already exists', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async generateVerificationCode(table: string): Promise<string> {
    let verificationCode: string;

    do {
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const checkIfCodeHasBeenGenerated =
        table === 'email'
          ? await this.prismaService.userEmail.findFirst({
              where: { verificationCode },
            })
          : await this.prismaService.userMobile.findFirst({
              where: { verificationCode },
            });

      if (!checkIfCodeHasBeenGenerated) {
        return verificationCode;
      }
    } while (true);
  }

  private async sendVerificationMail(data: Mail) {
    await this.userQueue.add('verifyEmailAddress', data);
  }

  private async sendVerificationOtp(otp: string) {
    await this.userQueue.add('verifyMobileNumber', { otp });
  }

  private async checkIfVerificationCodeExistsForAnEmail(
    email: string,
    verificationCode: string,
  ) {
    const userEmail = await this.prismaService.userEmail.findFirst({
      where: {
        email,
        verificationCode,
      },
    });

    if (!userEmail) {
      throw new GraphQLError('The OTP you entered is incorrect', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
  }

  private async checkIfVerificationCodeExistsForMobileNumber(
    mobile: string,
    verificationCode: string,
  ) {
    const userMobileNumber = await this.prismaService.userMobile.findFirst({
      where: {
        mobile,
        verificationCode,
      },
    });

    if (!userMobileNumber) {
      throw new GraphQLError('The OTP you entered is incorrect', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
  }
  private async findOrFailUser(id: number) {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    if (!user) {
      throw new GraphQLError(`Unable to find the user with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return user;
  }

  private async checkIfEmailExistsForUpdate(email: string, id: number) {
    const userEmail = await this.prismaService.userEmail.findFirst({
      where: { email },
    });

    if (userEmail && userEmail.userId !== id) {
      throw new GraphQLError('Email has already been taken', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async checkIfMobileNumberExistsForUpdate(mobile: string, id: number) {
    const userMobile = await this.prismaService.userMobile.findUnique({
      where: { mobile },
    });

    if (userMobile && userMobile.userId !== id) {
      throw new GraphQLError('Mobile Number has already been taken', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }
  }

  private async findOrFailStudyLevel(id: number) {
    const studyLevel = await this.prismaService.studyLevel.findFirst({
      where: { id },
    });

    if (!studyLevel) {
      throw new GraphQLError(`Unable to find the study level with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return studyLevel;
  }

  private async findOrFailInstitution(id: number) {
    const institution = await this.prismaService.institution.findFirst({
      where: { id },
    });
    if (!institution) {
      throw new GraphQLError(`Unable to find the institution with id ${id}`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return institution;
  }

  private async checkIfUserCan(id: number, userId: number, role: String) {
    if (role === Roles.Student) {
      if (id !== userId) {
        throw new GraphQLError(
          `You are not allowed to perform this operation`,
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        );
      }
    }
  }
}
