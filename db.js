const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5000,
  password: "postgre12123",
  database: "courier"
});

client.connect()
  .then(() => console.log("DB Connected"))
  .catch(err => console.error("DB Error", err));

module.exports = client;
