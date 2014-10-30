/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var loginObj    = require('./login')
  , contactObj   = require('./contact')
  , locationObj  = require('./location')
  , personalObj  = require('./personal');

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName: String
  , login:       loginObj
  , contact:     contactObj
  , location:    locationObj
  , personal:    personalObj
}); 

/**
 * Export schema
 */

exports = module.exports = employerSchema; 
