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
    credentials: {
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
    
    // Make sure model has not been saved before, else
    // we might end up hashing the password twice
    if (!applicant.isNew)
        return next(new Error("Can't save same model twice. Password has been hashed already!"));
    
    // Create a SALT
    bcrypt.genSalt(bcryptSettings.hashRounds, function(err, salt){
        if(err) return next(err);
        // Hash password
        bcrypt.hash(applicant.credentials.password, salt, function(err, hashedPassword){
            if(err) return next(err);
            // Overwrite plain text password with hashed version
            applicant.credentials.password = hashedPassword;
            next();
        });
    });
});

/**
 * Finds an applicant with the given credentials.
 * Returns true if the applicant exists
 * Password is expected to be in plain text
 * @param creds {Object} applicant credentials
 * @param cb {Function} callback 
 * @return {Bool} applicant exists
 * creds {
 *     password: {String}
 *   , email   : {String}
 * }
 */
applicantSchema.static('exists', function(creds,cb){
    var applicant = this;
    // Look for applicant with the given email
    applicant.findOne({'credentials.email' : creds.email}, function(err, applicant){
        if (err) return cb(err);
        // Compare applicant password hash with given credentials
        bcrypt.compare(creds.password, applicant.credentials.password, function(err, res){
            if (err) return cb(err);
            // res is true if passwords matched
            cb(null, res);
        });
    });
});

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
