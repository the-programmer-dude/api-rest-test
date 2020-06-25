export default class AppError extends Error {
  message: string;
  status: number;
  isOperational: boolean;
  constructor(status: number, message: string) {
    super(message);
    this.message = message;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
