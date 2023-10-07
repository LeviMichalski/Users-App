import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersControllerService } from './users-controller.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersControllerService: UsersControllerService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: UserDto): Promise<User> {
    return this.usersControllerService.getMe(user);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersControllerService.getAllUsers();
  }

  @Post()
  async signUp(@Body() userDto: UserDto): Promise<User> {
    return this.usersControllerService.signUp(userDto);
  }

  @Patch(':username')
  async editUser(@Body() userDto: UserDto): Promise<User> {
    return this.usersControllerService.editUser(userDto);
  }

  @Delete(':username')
  async deleteUser(@Param('username') username: string): Promise<User> {
    return this.usersControllerService.deleteUser(username);
  }
}
