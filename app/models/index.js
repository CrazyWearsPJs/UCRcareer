/**
 * Module Dependencies
 */

var mongoose = require('mongoose');

var applicantSchema   = require('./schema.applicant')
  , employerSchema    = require('./schema.employer')
  , jobPostingSchema  = require('./schema.jobPosting');

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
    dbRef.model('JobPosting' , jobPostingSchema);
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
 * creates a job posting model constructor
 * @param none
 * @return {Model}
 */

function jobPosting () {
	if (dbRef === undefined)
		throw new error('Need to register models first!');
	return dbRef.model('JobPosting');
}

/**
 * Exports
 */

module.exports = {
    register:  register
  , applicant: applicant
  , employer:  employer
  , jobPosting:  jobPosting
};
