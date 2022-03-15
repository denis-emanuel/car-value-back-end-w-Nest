import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // the 'context' object can be used to kind of abstract a WebSocket incoming message, a GRPC request and HTTP request, a lot of different kind of requests (graphql, etc)
    // 'data' is the argument provided when calling the decorator, @CurrentUser('gigel')
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
