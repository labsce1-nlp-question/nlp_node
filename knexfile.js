require('dotenv').config();
DATABASE_URL = process.env.DATABASE_URL;
DB_PASS = process.env.DB_PASS;
DB_USER = process.env.DB_USER;

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: DATABASE_URL,
      user: DB_USER,
      password: DB_PASS,
      database: "postgres"
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },


  production: {
    client: "pg",
    connection: {
      host: DATABASE_URL
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
};