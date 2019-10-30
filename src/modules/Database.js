const { MongoDB } = require("../database");

module.exports = class DatabaseModule {
  constructor(client) {
    this.name = "DatabaseModule";
    this.client = client;
    this.database = false;
  };

  async load() { 
    this.client.database = this.database;
    this.initializeDatabase(MongoDB)        
    this.client.log('Imported Database!', this.name)
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