import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CognitoUsersService } from './cognito-users.service';
import { UsersControllerService } from './users-controller.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    ConfigService,
    CognitoUsersService,
    UsersControllerService,
  ],
})
export class UsersModule {}
