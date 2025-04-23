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
