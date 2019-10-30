module.exports = class Error {
  constructor(client) {
    this.client = client;
    this.name = "error";
  };

  ON(error) {
    this.client.logError(error, 'ErrorEvent')
  }
}