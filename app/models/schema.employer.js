/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName:   String
  , login: {
        password:  String
      , uName:     String
    }
  , contact: {
        website:   String
      , linkedIn:  String
      , facebook:  String
      , twitter:   String
      , phoneNum:  String
      , email:     String
    }
  , location: {
        city:      String
      , state:     String
      , zip:       String
      , address1:  String
      , address2:  String
      , country:   String
    }
  , personal: {
        fName:     String
      , mInit:     String
      , lName:     String
    }
}); 

/**
 * Export schema
 */

exports = module.exports = employerSchema; 
