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
        jobTitle:     { type: String, required: true }
      , description:  { type: String, required: true }
      , requirements: { type: String, required: true }
      , salary:       { type: String, required: true }
      , application:  { type: String, required: true }
      , department:   { type: String }
      , jobType:      { type: String }
    }
  , location: {
        city:         { type: String, required: true }
      , state:        { type: String, required: true }
    }
  , date: {
        postedOn:     { type: String, required: true }
      , endsOn:       { type: String, required: true }
    }
}); 

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
