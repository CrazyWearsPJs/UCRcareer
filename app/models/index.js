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
 * creates an applicant model constructor
 * @param none
 * @return {Model}
 */

function applicant () {
	if (dbref === undefined)
		throw new error('Need to register models first!');
	return dbref.model('Applicant');
}

/**
 * creates an employer model constructor
 * @param none
 * @return {Model}
 */

function employer () {
	if (dbref === undefined)
		throw new error('Need to register models first!');
	return dbref.model('Employer');
}

/**
 * Export model registration 
 */

module.exports = {
    register:  register
  , applicant: applicant
  , employer:  employer
};
