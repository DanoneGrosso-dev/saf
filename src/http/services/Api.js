const axios = require("axios");

const api = axios.create({ baseURL: 'https://discordapp.com/api' });

module.exports = api
