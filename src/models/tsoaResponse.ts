import {ErrorDetails} from '../errors.js';

export interface ITsoaErrorResponse {
  resultType: string;
  error: {
    errorCode: string;
    reason: string;
    data: ErrorDetails;
  };
  success: null;
}

export interface ITsoaSuccessResponse<T> {
  resultType: string;
  error: null;
  success: {data: T};
}

export class TsoaSuccessResponse<T> {
  resultType: string = 'SUCCESS';
  error = null;
  success: {data: T};

  constructor(data: T) {
    this.success = {data};
  }
}
