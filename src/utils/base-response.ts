export class BaseResponse {
    static success(data: any, message = 'Success', code = 200) {
      return {
        code,
        message,
        data,
      };
    }
  
    static error(message = 'An error occurred', code = 500, errorData = null) {
      return {
        code,
        message,
        error: errorData,
      };
    }
  }
  