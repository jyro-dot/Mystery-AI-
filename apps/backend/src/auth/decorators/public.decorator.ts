import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Public = createParamDecorator(
  (_: undefined, ctx: ExecutionContext) => {
    return SetMetadata('isPublic', true);
  },
);

import { SetMetadata } from '@nestjs/common';
export const IsPublic = () => SetMetadata('isPublic', true);
