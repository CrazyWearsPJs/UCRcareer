/**
 * Module Dependencies
 */
 
var models    = require('../models')
  , Applicant = models.applicant()
  , Employer  = models.employer();

/**
 * Create a new applicant in our db
 * @param applicantInfo {Object} Should match schema
 * @return none
 */

function createApplicant (applicantInfo) {
	var johnDoe = new Applicant(applicantInfo);
	johnDoe.save();
}

/**
 * Create a new employer in our db
 * @param employerInfo {Object} Should match schema
 * @return none
 */

function createEmployer (employerInfo) {
	var janeDoe = new Employer(employerInfo);
	janeDoe.save();
}

/**
 * Exports
 */
module.exports = {
	createApplicant : createApplicant
  , createEmployer  : createEmployer
}
