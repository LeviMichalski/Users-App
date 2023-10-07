/* eslint-disable */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //This decorator allows our prisma module to be available everywhere in our app!
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //We export this, so we can have access to it in our auth.module import.
})
export class PrismaModule {}
