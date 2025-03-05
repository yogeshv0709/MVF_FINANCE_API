class ApiResponse {
  constructor(code, data, message = "Success") {
    this.code = code;
    this.message = message;
    this.status = code < 400 ? "success" : "fail";
    this.data = data;
  }
}

module.exports = ApiResponse;
