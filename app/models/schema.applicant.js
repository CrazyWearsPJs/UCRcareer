/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , Schema   = mongoose.Schema;

var config   = require('../config');

var bcryptSettings = config.bcryptSettings;

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
 * Set pre-save hook for replacing password field
 * with its hashed version
 */

applicantSchema.pre('save', function(next){
    var applicant = this;
    
    // Make sure if password has been set before,
    // DON'T HASH IT AGAIN and stop saving model
    if (applicant.isDirectModified('password'))
        return next(new Error("Can't save same model twice. Password has been hashed already!"));
    
    // Create a SALT
    bcrypt.genSalt(bcryptSettings.hashRounds, function(err, salt){
        if(err) return next(err);
        // Hash password
        bcrypt.hash(applicant.login.password, salt, function(err, hashedPassword){
            if(err) return next(err);
            // Overwrite plain text password with hashed version
            applicant.login.password = hashedPassword;
            next();
        });
    });
});

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
