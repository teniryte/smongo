'use strict';

const Database = require('./database');

const state = {
  databases: {},
};

function database (dbName = 'test') {
  if (state.databases[dbName]) return state.databases[dbName];
  let db = new Database(dbName);
  state.databases[dbName] = db;
  return db;
}

module.exports = database;
