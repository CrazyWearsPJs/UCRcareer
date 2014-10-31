/**
 * Module Dependencies
 */
 
var models     = require('../models')
  , Applicant  = models.applicant()
  , Employer   = models.employer()
  , JobPosting = models.jobPosting();

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
 * Create a new job posting in our db
 * @param jobPostingInfo {Object} Should match schema
 * @return none
 */

function createJobPosting (jobPostingInfo) {
	var jobPost = new JobPosting(jobPostingInfo);
	jobPost.save();
}

/**
 * Exports
 */
module.exports = {
    createApplicant   : createApplicant
  , createEmployer    : createEmployer
  , createJobPosting  : createJobPosting
}
