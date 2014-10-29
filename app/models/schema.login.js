/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define login schema
 */

var loginSchema = new Schema({
	password: String
  , uName:    String
}); 

/**
 * Export schema
 */

exports = module.exports = loginSchema;
