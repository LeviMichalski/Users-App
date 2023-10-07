//The point of this class is to contain the business logic like connecting to the database, editing the fields, etc.
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(dto: AuthDto) {
    const { username, name, email, phoneNumber, isAdmin } = dto;
    const user = await this.prisma.user.create({
      data: {
        username,
        name,
        email,
        phoneNumber,
        isAdmin,
      },
    });
    return user;
  }
}

//This function will take the info taken in by the end user and queries the database with the info to find a match. We first encrypt the data(the hash and the password) and if it matches, we will return the "payload" (the userId and email) alongside an encrypted user object as a token.
// async signin(dto: AuthDto) {
//   // find the user by email
//   const user = await this.prisma.user.findUnique({
//     where: {
//       username: dto.username,
//     },
//   });
//   // if user does not exist, throw exception
//   if (!user) throw new ForbiddenException('Credentials incorrect!'); //Use a guard condition here
//   // compare passwords
//   // const pwMatches =
//   // // if password is incorrect, throw exception
//   // if (!pwMatches) throw new ForbiddenException('Credentials incorrect!');
//
//   // send back user
//   return this.signToken(user.username, user.email);
// }
//
// //This function will encrypt the data(userId and email) into a jwt file for transfer from the end user to the database.
// async signToken(username: string, email: string) {
//   const payload = {
//     username,
//     email,
//   };
//   //The JWT_SECRET global constant is found in the .env file locally.
//   const secret = this.config.get('JWT_SECRET');
//
//   //The await keyword is crucial here!!!!
//   const token = await this.jwt.signAsync(payload, {
//     expiresIn: '15m', //Rejects the token after 15 minutes, and the user will need to sign in again.
//     secret: secret,
//   });
//
//   return {
//     access_token: token,
//   };
// }
