/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define contact schema
 */

var contactSchema = new Schema({
	website:  String
  , linkedIn: String
  , facebook: String
  , twitter:  String
  , phoneNum: String
  , email:    String
}); 

/**
 * Export schema
 */

exports = module.exports = contactSchema;
