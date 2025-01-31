import { ZodSchema } from "zod";
import { ERRORS } from "../../domain/enums/errors.enum";
import { PreconditionFailedError } from "../http/responses";

function Validate(schema: ZodSchema<any>) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = schema.safeParse(args[0]);

      if (!result.success) {
        throw PreconditionFailedError({
          message: ERRORS.VALIDATION_ERROR,
          errors: result.error.issues,
        });
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export { Validate };
