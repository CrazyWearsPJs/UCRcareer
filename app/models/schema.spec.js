/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define specialization schema
 */

var specSchema = new Schema({
	degree: String
  , univ:   String
  , year:   String
  , resume: String
  , focus:  String
}); 

/**
 * Export schema
 */

exports = module.exports = specSchema;
