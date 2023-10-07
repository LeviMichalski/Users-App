import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt', //This is already implied, and you can name this token anything you want based on what it does, for example 'jwt-refresh' if it is a refresh token.
) {
  constructor(
    config: ConfigService, //We don't make this private because we wouldn't be able to access it in the super function, and it's not used elsewhere.
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //We use a bearer token that we are given upon login. If we do not have the right token, then we do not have access to this route.
      // secretOrKey: config.get('JWT_SECRET'),
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: any) {
    console.log('this is the payload username: ' + payload.username);
    return payload.username;
  }
}
