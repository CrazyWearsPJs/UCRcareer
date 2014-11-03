/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName:   { type: String, required: true } 
  , credentials: {
        password:  { type: String, required: true }
      , uName:     { type: String, required: true }
    }
  , contact: {
        website:   { type: String }
      , linkedIn:  { type: String }
      , facebook:  { type: String }
      , twitter:   { type: String }
      , phoneNum:  { type: String }
      , email:     { type: String, required: true }
    }
  , location: {
        city:      { type: String, required: true }
      , state:     { type: String, required: true }
      , zip:       { type: String, required: true }
      , address1:  { type: String, required: true }
      , address2:  { type: String }
      , country:   { type: String, required: true }
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

exports = module.exports = employerSchema; 
