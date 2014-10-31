/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define job posting schema
 */

var jobPostingSchema = new Schema({
    specifics: {
        jobTitle:     String
      , description:  String
      , requirements: String
      , salary:       String
      , department:   String
      , jobType:      String
    }
  , location: {
        city:         String
      , state:        String
    }
  , date: {
        post:         String
      , close:        String
    }
  , employerId:        String
}); 

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
