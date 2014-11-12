/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , Schema   = mongoose.Schema;

var config   = require('../config');

var bcryptSettings = config.bcryptSettings;

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName:   { type: String, required: true, unique: true } 
  , credentials: {
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
  , personal: {
        fName:     { type: String, required: true }
      , mInit:     { type: String }
      , lName:     { type: String, required: true }
    }
}); 

/**
 * Extend doc.toObject to "hide" sensitive properties
 * Useful for hiding information such as login credentials.
 */

if(!employerSchema.options.toObject) employerSchema.options.toObject = {};
 employerSchema.options.toObject.hide = [];
 employerSchema.options.toObject.transform = function(doc, ret, options) {
         if(options.hide) {
            options.hide.forEach(function(prop) { 
                delete ret[prop];
            });
        }
 };

/*
 * Changes the password of an employer, used for registration or
 * password change (password forgot/manual password change flows)
 *
 * @this {employer} Instance of an employer model
 * @this.credentials.password {String} The plaintext password to be hashed
 */

employerSchema.methods.hashPassword = function(next) {
    var employer = this;
    
    //create a SALT
    bcrypt.genSalt(bcryptSettings.hashRounds, function(err, salt){
        if(err) return next(err);
        // Hash password
        bcrypt.hash(employer.credentials.password, salt, function(err, hashedPassword){
            if(err) return next(err);
            // Overwrite plain text password with hashed version
            employer.credentials.password = hashedPassword;
            next();
        });
    });
};

/**
 * Setter to set a new plain-text password
 *
 * @param plainTextPassword {String} Plain-text password which will be hashed upon save
 */
employerSchema.methods.setPassword = function(plainTextPassword) {
    var employer = this;
    employer.plainTextPassword = true;
    employer.credentials.password = plainTextPassword;
};

/**
 * Set pre-save hook for replacing password field
 * with its hashed version
 */
employerSchema.pre('save', function(next){
    var employer = this;
    
    // Make sure model has not been saved before, else
    // we might end up hashing the password twice
    
    if (employer.isNew || employer.plainTextPassword) {
        employer.hashPassword(next);
    } else {
        next();
    }
});

/**
 * Wrapper around Employer.findOne('{credentials.email': ...
*/
employerSchema.static('findByEmail', function(email, cb) {
    var Employer = this;
    Employer.findOne({'credentials.email': email}, function(err, employer) {
        return cb(err, employer);
    });
});

/**
 * Finds an employer with the given credentials.
 * Returns true if the employer exists
 * Password is expected to be in plain text
 * @param creds {Object} employer credentials
 * @param cb(err, employer) {Function} callback 
 * @cb-param err {Error} error if credentials doesnt match an employer, null otherwise
 * @cb-param employer {employer} employer object if credentials match an employer, null otherwise
 * creds {
 *     password: {String}
 *   , email   : {String}
 * }
 */
employerSchema.static('findByCredentials', function(creds,cb){
    var Employer = this;
    // Look for employer with the given email
    Employer.findByEmail(creds.email, function(err, employer){
        if (err) return cb(err, null);
        if (!employer) {
            var err = new Error('Employer doesn\'t exist' );
            err.name = 'error';
            return cb(err, null);
        }
    // Compare employer password hash with given credentials
        bcrypt.compare(creds.password, employer.credentials.password, function(err, res){
            if (err) return cb(err);
            // if res is true, return employer, otherwise return error and null
            if(res) {
                return cb(null, employer);
            } else {
                var err = new Error("Given password does not match actual");
                err.name = "InvalidPasswordError";
                return cb(err, null);
            }
        });
    });
});


/**
 * Instance method that returns the object representation
 * of an employer while hiding sensitive information
 * @return {Object} object representation of an employer instance
 */
employerSchema.methods.getProfileData = function() {
    var employer = this;
    return employer.toObject({
        'hide': ['credentials', '_id', '__v'] 
        , 'transform': true
    });
};

/**
 * Export schema
 */

exports = module.exports = employerSchema; 
