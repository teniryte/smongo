'use strict';

const _ = require('ooi');
const mongoose = require('mongoose');
const autoIncrement = require('./plugins/auto-increment');
const Types = require('./types');
const modelMeta = _.classMeta(require('./model'));
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

class Database extends Types {
  constructor(dbName = 'test') {
    super();
    this.dbName = dbName;
    this.url = `mongodb://localhost/${dbName}`;
    this.options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
    this.allModels = {};
    this.connect();
  }

  connect() {
    let connection = mongoose.createConnection(this.url, this.options);
    autoIncrement.initialize(connection);
    this.connection = connection;
    return this;
  }

  getFields(Class) {
    let item = new Class();
    return _.extend({}, item);
  }

  getVirtuals(methods) {
    let virtuals = {};
    _.each(methods, (method, name) => {
      if (name[0] !== '$') return;
      virtuals[name.slice(1)] = method;
      delete method[name];
    });
    return virtuals;
  }

  createSchema(meta, Class) {
    let schema = new Schema(meta.fields),
      index = Class,
      virtuals = this.getVirtuals(meta.methods);
    _.extend(schema.methods, modelMeta.methods, meta.methods);
    _.extend(schema.statics, modelMeta.staticMethods, meta.staticMethods);
    if (index) schema.index = index;
    _.each(virtuals, (method, name) => {
      schema.virtual(name).get(method);
    });
    schema.plugin(autoIncrement.plugin, { model: meta.name, field: 'id' });
    return schema;
  }

  getMeta(Class) {
    return _.extend(_.classMeta(Class), { fields: this.getFields(Class) });
  }

  model(Class) {
    let meta = this.getMeta(Class),
      schema = this.createSchema(meta, Class),
      Model = this.connection.model(meta.name, schema);
    this.allModels[meta.name] = Model;
    this[meta.name] = Model;
    return Model;
  }

  models(...Classes) {
    _.each(Classes, (Class) => this.model(Class));
    return this;
  }
}

module.exports = Database;
