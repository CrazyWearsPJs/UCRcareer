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
 * @param cb(err, applicant) {Function} callback 
 * @cb-param  err {Error} error if credentials doesnt match an applicant, null otherwise
 * @cb-param  applicant {applicant} applicant object if credentials match an applicant, null otherwise
 * creds {
 *     password: {String}
 *   , email   : {String}
 * }
 */
applicantSchema.static('findByCredentials', function(creds,cb){
    var Applicant = this;
    // Look for applicant with the given email
    Applicant.findOne({'credentials.email' : creds.email}, 
    function(err, applicant){
        if (err) return cb(err, null);
        if (!applicant) {
            var err = new Error("Applicant doesn't exist");
            err.name = "error";
            return cb(err, null);
        }
        // Compare applicant password hash with given credentials
        bcrypt.compare(creds.password, applicant.credentials.password,
        function(err, res){
            if (err) return cb(err, null);
            // if passwords match, then return null as the error, and return the applicant object, 
            // otherwise, return the error and null for the applicant object
            if (res) {
                return cb(null, applicant);
            } else {
                var err = new Error('Given password does not match actual');
                err.name = 'InvalidPasswordError';
                return cb(err, null);
            }
        });
    });
});

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
