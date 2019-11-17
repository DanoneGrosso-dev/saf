const { MongoDB } = require("../database");

module.exports = class DatabaseLoader {
  constructor(client) {
    this.name = "DatabaseLoader";
    this.client = client;
    this.database = false;
  };

  async load() { 
    this.client.database = this.database;
    this.initializeDatabase(MongoDB);  
  };

  initializeDatabase(DBWrapper, options = {}) {
    this.client.database = new DBWrapper(options)
    this.client.database.startConnection()
      .then(() => this.client.log('Connection was made to the database!', 'DatabaseConnect'))
      .catch(e => {
        this.client.logError(e.message, this.name)
        this.client.database = null
      });
  };
};