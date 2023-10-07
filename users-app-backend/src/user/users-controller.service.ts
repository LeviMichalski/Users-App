import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { GetUser } from '../auth/decorator';
import { User } from './user.model';
import { UsersService } from './users.service';
import { CognitoUsersService } from './cognito-users.service';

@Injectable()
export class UsersControllerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly cognitoUsersService: CognitoUsersService,
  ) {}

  async getMe(@GetUser() user: UserDto): Promise<User> {
    return this.usersService.getMe(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  async signUp(userDto: UserDto): Promise<User> {
    await this.cognitoUsersService.signUp(userDto);
    return this.usersService.signUp(userDto);
  }

  async editUser(userDto: UserDto): Promise<User> {
    let { username } = userDto;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException();
    }

    await this.cognitoUsersService.editUser(userDto);
    return this.usersService.editUser(userDto);
  }

  async deleteUser(username: string): Promise<User> {
    await this.cognitoUsersService.deleteUser(username);
    return this.usersService.deleteUser(username);
  }
}
