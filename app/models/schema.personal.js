/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define personal schema
 */

var personalSchema = new Schema({
	fName:    String
  , mInit:    String
  , lName:    String
  , jobTitle: String
}); 

/**
 * Export schema
 */

exports = module.exports = personalSchema;
