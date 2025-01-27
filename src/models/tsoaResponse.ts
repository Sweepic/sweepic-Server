export class Response<T> {
  resultType: string = 'SUCCESS';
  error = null;
  success: {data: T};

  constructor(data: T) {
    this.success = {data};
  }
}
