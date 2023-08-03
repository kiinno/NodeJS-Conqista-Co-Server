class ApiError extends Error {
  constructor(statusCode, message, name, data) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = name;
    this.data = data;
  }
}

module.exports = ApiError;
