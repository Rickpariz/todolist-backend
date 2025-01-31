export interface IDomainError {
  message: string;
  statusCode: number;
  errors?: any;
}

export class DomainError extends Error implements IDomainError {
  constructor({ message, statusCode, errors }: IDomainError) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
  statusCode: number;
  errors: any;
}
