import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType, ZodTypeDef } from 'zod';

/**
 * Generic pipe that validates a value (typically a query/body) against any Zod
 * schema, formatting parse errors into a readable 400 response. Accepts any
 * input type so schemas using .transform()/.default() (input != output) work.
 */
export class ZodValidationPipe<T = unknown> implements PipeTransform {
  constructor(private readonly schema: ZodType<T, ZodTypeDef, any>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const message = result.error.issues
        .map(
          (issue) => `${issue.path.join('.') || '(value)'}: ${issue.message}`,
        )
        .join('; ');
      throw new BadRequestException(message);
    }

    return result.data;
  }
}
