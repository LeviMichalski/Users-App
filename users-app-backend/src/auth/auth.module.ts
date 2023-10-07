import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';
import { AuthConfig } from './auth.config';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret',
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthConfig],
  exports: [AuthService],
})
export class AuthModule {} //We are really only exporting this for other classes to have access to this module's imports, controllers, and providers. We have it like this for code abstraction and to prevent repetition.
