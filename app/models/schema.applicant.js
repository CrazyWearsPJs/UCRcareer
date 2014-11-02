/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define applicant schema
 */

var applicantSchema = new Schema({
    login: {
        password:  { type: String, required: true }
      , email:     { type: String, required: true, lowercase: true, unique: true }
    }
  , contact: {
        website:   { type: String } 
      , linkedIn:  { type: String }
      , facebook:  { type: String }
      , twitter:   { type: String }
      , phoneNum:  { type: String }
    }
  , location: {
        city:      { type: String, required: true }
      , state:     { type: String, required: true }
      , zip:       { type: String, required: true }
      , address1:  { type: String, required: true }
      , address2:  { type: String }
      , country:   { type: String, required: true }
    }
  , spec: {
        degree:    { type: String }
      , univ:      { type: String }
      , year:      { type: String }
      , resume:    { type: String }
      , focus:     { type: String }
    }
  , personal: {
        fName:     { type: String, required: true }
      , mInit:     { type: String }
      , lName:     { type: String, required: true }
    }
}); 

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
