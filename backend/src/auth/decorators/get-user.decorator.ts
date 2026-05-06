import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Populated by JwtAuthGuard
    return data ? user[data] : user;
  },
);



