//The whole point of this class is to receive a signal from the end user and to handle the incoming request by creating an instance of the authService.
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/'; //We just have ./dto so we can import from the whole folder rather than specific files

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    //The authService variable is how we can instantiate an instance of authService. NestJS does some background magic to make this work.
  }

  @Post(`signup`)
  async signup(@Body() dto: AuthDto) {
    //DTO stands for data transfer object. It defines how the data will be sent over the network.
    try {
      console.log(dto);
      return await this.authService.registerUser(dto);
    } catch (error) {
      console.log(dto);
      throw new BadRequestException(
        'Error signing up in auth.controller.ts: ' + error.message,
      );
    }
  }
}
