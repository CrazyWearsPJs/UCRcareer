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
        jobTitle:     { type: String }
      , description:  { type: String }
      , requirements: { type: String }
      , salary:       { type: String }
      , department:   { type: String }
      , jobType:      { type: String }
    }
  , location: {
        city:         { type: String }
      , state:        { type: String }
    }
  , date: {
        postedOn:     { type: String }
      , endsOn:       { type: String }
    }
}); 

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
