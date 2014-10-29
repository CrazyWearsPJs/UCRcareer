/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var loginSchema     = require('./schema.login')
  , contactSchema   = require('./schema.contact')
  , locationSchema  = require('./schema.location')
  , personalSchema  = require('./schema.personal');

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName: String
  ,	login:       [loginSchema]
  , contact:     [contactSchema]
  , location:    [locationSchema]
  , personal:    [personalSchema]
}); 

/**
 * Export schema
 */

exports = module.exports = employerSchema; 
