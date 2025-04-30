import { StatusCodes } from 'http-status-codes';

export const internalServerErrorResponse = (error: any) => {
  return {
    status: false,
    err: error,
    data: {},
    message: 'Internal server error'
  };
};

export const customErrorResponse = (error: any) => {
  if (!error.message && !error.explanation) {
    internalServerErrorResponse(error);
  }
  return {
    status: false,
    err: error.explanation,
    data: {},
    message: error.message
  };
};

export const successResponse = (data: any, message: any) => {
  return {
    status: true,
    data,
    message,
    error: {}
  };
};

export class ClientError extends Error {
  explanation;
  status;
  constructor(error: any) {
    super();
    this.name = 'Client Error';
    this.message = error.message;
    this.explanation = error.explanation;
    this.status = error.status ? error.status : StatusCodes.BAD_REQUEST;
  }
}
