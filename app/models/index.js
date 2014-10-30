/**
 * Module Dependencies
 */

var mongoose = require('mongoose');

var applicantSchema = require('./schema.applicant')
  , employerSchema  = require('./schema.employer');

/**
 * Register models
 * @param db {Connection} Mongoose connection
 * @return none
 * @api public
 */

function register (db) {
    db.model('Applicant', applicantSchema);
    db.model('Employer' , employerSchema);
}

/**
 * Export model registration 
 */

module.exports = {
    register: register
};
