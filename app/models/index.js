/**
 * Module Dependencies
 */

var mongoose = require('mongoose');

var applicantSchema = require('./schema.applicant')
  , employerSchema  = require('./schema.employer');

var dbRef = undefined;

/**
 * Register models and sets local db reference
 * @param db {Connection} Mongoose connection
 * @return none
 */

function register (db) {
    dbRef = db;
	dbRef.model('Applicant', applicantSchema);
    dbRef.model('Employer' , employerSchema);
}

/**
 * creates an applicant document constructor IE a model
 * @param none
 * @return {Model}
 */

function applicant () {
	if (dbRef === undefined)
		throw new error('Need to register models first!');
	return dbRef.model('Applicant');
}

/**
 * creates an employer document constructor IE a model
 * @param none
 * @return {Model}
 */

function employer () {
	if (dbRef === undefined)
		throw new error('Need to register models first!');
	return dbRef.model('Employer');
}

/**
 * Exports
 */

module.exports = {
    register:  register
  , applicant: applicant
  , employer:  employer
};
