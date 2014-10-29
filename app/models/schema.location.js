/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define location schema
 */

var locationSchema = new Schema({
	city:    String
  , state:   String
  , zip:     String
  , address: String
  , country: String
}); 

/**
 * Export schema
 */

exports = module.exports = locationSchema;
