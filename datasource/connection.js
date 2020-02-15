const { Client } = require("elasticsearch");
const client = new Client({
  host: process.env.BONSAI_URL
  //log: "trace"
});

module.exports = client;
