'use strict';

const _ = require('ooi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Types extends _.EventEmitter {

  string (defaultValue = null) {
    return { type: String, default: defaultValue };
  }

  array (...args) {
    return [...args];
  }

  date (defaultValue = null) {
    return { type: Date, default: defaultValue };
  }

  boolean (defaultValue = null) {
    return { type: Boolean, default: defaultValue };
  }

  object (defaultValue = {}) {
    return { type: Schema.Types.Mixed, default: defaultValue };
  }

  number (defaultValue = null) {
    return { type: Number, default: defaultValue };
  }

  buffer (defaultValue = []) {
    return { type: Buffer, default: defaultValue };
  }

  other (ref = null) {
    return { type: Schema.Types.ObjectId, ref: ref };
  }

  map (data = {}) {
    return data;
  }

}

module.exports = Types;
