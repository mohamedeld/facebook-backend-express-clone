class ApiError extends Error{
  
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode.toString().startsWith('4') ? 'fail' : 'error'}`;
      this.isOperational = true;
      Object.setPrototypeOf(this, ApiError.prototype); 
    }
  }
  
  module.exports= ApiError;