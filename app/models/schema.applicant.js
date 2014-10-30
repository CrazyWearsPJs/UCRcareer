/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var loginSchema     = require('./schema.login')
  , contactSchema   = require('./schema.contact')
  , locationSchema  = require('./schema.location')
  , specSchema      = require('./schema.spec')
  , personalSchema  = require('./schema.personal');

/**
 * Define applicant schema
 */

var applicantSchema = new Schema({
    login:    loginSchema
  , contact:  contactSchema
  , location: locationSchema
  , spec:     specSchema
  , personal: personalSchema
}); 

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
