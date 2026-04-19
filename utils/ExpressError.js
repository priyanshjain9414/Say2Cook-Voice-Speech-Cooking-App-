class ExpressError extends Error {
  constructor(status, message) {
    super(message); // important fix
    this.status = status;
  }
}

export default ExpressError;
