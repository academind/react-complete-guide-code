class NotFoundError {
  constructor(message) {
    this.message = message;
    this.status = 404;
  }
}

exports.NotFoundError = NotFoundError;