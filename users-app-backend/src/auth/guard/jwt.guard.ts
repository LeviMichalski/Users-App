import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

//We have this class so we can abstract the usage of the jwt string so it's less prone to errors.
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
  //   // Access the request object from the ExecutionContext
  //   const request = context.switchToHttp().getRequest();
  //
  //   // Perform authentication and authorization checks here
  //   if (!request.user) {
  //     // If there's no user in the request, deny access
  //     return false;
  //   }
  //
  //   // If all checks pass, allow access
  //   return true;
  // }
}
