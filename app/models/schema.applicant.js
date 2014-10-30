/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var loginObj     = require('./login')
  , contactObj   = require('./contact')
  , locationObj  = require('./location')
  , specObj      = require('./spec')
  , personalObj  = require('./personal');

/**
 * Define applicant schema
 */

var applicantSchema = new Schema({
	login:    loginObj
  , contact:  contactObj
  , location: locationObj
  , spec:     specObj
  , personal: personalObj
}); 

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
