const express = require("express");
const cors = require("cors");

const routes = require('../http/api');

module.exports = class HTTPServerLoader {
  constructor(client) {
    this.name = "HTTPServerLoader";
    this.client = client;    
  };

  async load() {    
    this.initializeHTTPServer()
  };

  async initializeHTTPServer(port = process.env.PORT || 3333) {
    this.app = express();

    this.app.use(cors());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));    
    
    this.addRoute();

    this.app.listen(port, (err) => {
      this.client.log('App connected to port 3333', 'API')      
    });
  };

  async addRoute(){
    for (let name in routes) {
      const loader = new routes[name](this.client, this.app);
      let success = false;
      try {
        success = await loader.register();
      } catch (e) {
        this.client.logError(e);
      } finally {
        if(!success && loader.critical) process.exit(1);
      };
    };
  };
};