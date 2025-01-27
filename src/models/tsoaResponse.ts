export class response {
  resultType: string = 'SUCCESS';
  error = null;
  success: {data: any};

  constructor(data: any) {
    this.success = {data};
  }
}
