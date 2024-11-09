export class BaseResponseSuccess<T> {
  constructor(
    public data: T,
    public statusCode: number,
    public message: string,
  ) {}
}