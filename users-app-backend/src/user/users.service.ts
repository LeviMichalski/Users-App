import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { GetUser } from '../auth/decorator';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMe(@GetUser() user: UserDto): Promise<User> {
    const username = user.username;
    return this.prismaService.user.findUnique({ where: { username } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async signUp(userDto: UserDto): Promise<User> {
    let { username, name, email, phoneNumber, isAdmin } = userDto;

    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          username,
          name,
          email,
          phoneNumber,
          isAdmin,
        },
      });
      return createdUser;
    } catch (err) {
      throw err;
    }
  }

  async editUser(updateUserDto: UserDto): Promise<User> {
    let { username, name, email, phoneNumber, isAdmin } = updateUserDto;

    const updatedUser = await this.prismaService.user.update({
      where: { username },
      data: {
        username,
        name,
        email,
        phoneNumber,
        isAdmin,
      },
    });
    return updatedUser;
  }

  async deleteUser(username: string): Promise<User> {
    return this.prismaService.user.delete({ where: { username } });
  }
}
