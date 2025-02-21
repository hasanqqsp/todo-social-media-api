import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: { data: unknown }) => ({
        ...response,
        data: plainToClass(this.dto, response.data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }) as object,
      })),
    );
  }
}
