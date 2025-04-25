const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "",
  port: ,
  password: "",
  database: ""
});

client.connect()
  .then(() => console.log("DB Connected"))
  .catch(err => console.error("DB Error", err));

module.exports = client;
