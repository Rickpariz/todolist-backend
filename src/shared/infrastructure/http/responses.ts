import { DomainError } from "../../domain/domain.error";
import { HttpResponse } from "../../domain/controller";

export const Ok = (body: unknown): HttpResponse => {
  return {
    statusCode: 200,
    body,
  };
};

export const Created = (body: unknown): HttpResponse => {
  return {
    statusCode: 201,
    body,
  };
};

export const PreconditionFailedError = (data: {
  message: string;
  errors: any;
}): DomainError => {
  return new DomainError({ ...data, statusCode: 412 });
};

export const Conflict = (message: string): DomainError => {
  return new DomainError({ statusCode: 409, message });
};

export const Unauthorized = (message?: string): DomainError => {
  return new DomainError({
    statusCode: 401,
    message: message || "UNAUTHORIZED",
  });
};

export const NotFound = (message: string): DomainError => {
  return new DomainError({ statusCode: 404, message });
};
