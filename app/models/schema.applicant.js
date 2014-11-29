/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , _        = require('underscore')
  , Schema   = mongoose.Schema; 

var config   = require('../config');

var bcryptSettings = config.bcryptSettings;

/**
 * Define applicant schema
 */

var applicantSchema = new Schema({
    credentials: {
        password:      { type: String, required: true }
      , email:         { type: String, required: true, lowercase: true, unique: true }
    }
  , contact: {
        website:       { type: String } 
      , linkedIn:      { type: String }
      , facebook:      { type: String }
      , twitter:       { type: String }
      , phoneNum:      { type: String }
    }
  , location: {
        city:          { type: String, required: true }
      , state:         { type: String, required: true }
      , zip:           { type: String, required: true }
      , address1:      { type: String, required: true }
      , address2:      { type: String }
      , country:       { type: String, required: true }
    }
  , spec: {
        degree:        { type: String }
      , univ:          { type: String }
      , year:          { type: String }
      , resume:        { type: String }
      , focus:         { type: String }
    }
  , personal: {
        fName:         { type: String, required: true }
      , mInit:         { type: String }
      , lName:         { type: String, required: true }
    }
  , interests:         [ String ]
  , bookmarkedPosts:   [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }]
  , postNotifications: [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }]
}); 

/**
 * Extends doc.toObject to "hide" sensitive properties.
 * Useful for hiding information such as login credentials.
 *
 */

if(!applicantSchema.options.toObject) applicantSchema.options.toObject = {};
applicantSchema.options.toObject.hide = [];
applicantSchema.options.toObject.transform = function(doc, ret, options) {
    if(options.hide) {
        options.hide.forEach(function(prop) { 
            delete ret[prop];
        });
    }
};

/*
 * Changes the password of an applicant, used for registration or
 * password change (password forgot/manual password change flows)
 *
 * @this {applicant} Instance of an applicant model
 * @this.credentials.password {String} The plaintext password to be hashed
 */
applicantSchema.methods.hashPassword = function(next) {
    var applicant = this;
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
};

/**
 *
 * Setter to set a new plain-text password 
 *
 * @param plainTextPassword {String} Plain-text password which will be hashed upon save
 */
applicantSchema.methods.setPassword = function(plainTextPassword) {
    var applicant = this;
    applicant.plainTextPassword = true;
    applicant.credentials.password = plainTextPassword;
};

/**
 * Adds a job posting id to applicant's bookmarked posts
 * @param postId {ObjectId} Job posting id
 * @param cb {Function} callback
 */

applicantSchema.methods.addBookmark = function(postId, cb){
    var applicant = this;
    // If bookmark already exists, don't do anything
    if (_.indexOf(applicant.bookmarkedPosts, postId, true) !== -1)
        return;

    // Figure out where to insert post id as to keep array of 
    // bookmarked posts sorted
    var insertionPoint = _.sortedIndex(applicant.bookmarkedPosts, postId);
    applicant.bookmarkedPosts.splice(insertionPoint, 0, postId);

    applicant.save(cb);
}

/**
 * Removes a job posting id from the applicant's bookmarked posts
 * @param postId {ObjectId} Job posting id
 */

applicantSchema.methods.removeBookmark = function(postId){
    var applicant = this;
    // Figure out where the id to remove is located
    var removalPoint = _.indexOf(applicant.bookmarkedPosts, postId, true);
    // If bookmark doesn't exist, then there is nothing to do!
    if ( removalPoint === -1)
        return;
    applicant.bookmarkedPosts.splice(removalPoint, 1);
}

/**
 * Adds a job posting id to applicant's notification queue
 * @param postId {ObjectId} Job posting id
 */

applicantSchema.methods.addPostNotification = function(postId){
    var applicant = this;
    // If notification already exists, don't do anything
    if (_.indexOf(applicant.postNotifications, postId, true) !== -1)
        return;

    // Figure out where to insert post as to keep array of 
    // post notifications sorted
    var insertionPoint = _.sortedIndex(applicant.postNotifications, postId);
    applicant.postNotifications.splice(insertionPoint, 0, postId);
}

/**
 * Removes a job posting id from the applicant's notification queue
 * @param postId {ObjectId} Job posting id
 */

applicantSchema.methods.removePostNotification = function(postId){
    var applicant = this;
    // Figure out where the id to remove is located
    var removalPoint = _.indexOf(applicant.postNotifications, postId, true);
    // If bookmark doesn't exist, then there is nothing to do!
    if ( removalPoint === -1)
        return;
    applicant.postNotifications.splice(removalPoint, 1);
}

/**
 * Set pre-save hook for replacing password field
 * with its hashed version
 */
applicantSchema.pre('save', function(next){
    var applicant = this;
   
    // Make sure model has not been saved before, else
    // we might end up hashing the password twice 
    if (applicant.isNew || applicant.plainTextPassword) {
        applicant.hashPassword(next);
    } else {
        next();
    }
});

/*
 * Wrapper around Applicant.findOne({'credentials.email' . .. 
 * Applicant will have bookmarkedPosts populated
 */

applicantSchema.static('findByEmail', function(email, cb) {
    var Applicant = this;

    Applicant.findOne({'credentials.email' : email})
        .populate("bookmarkedPosts", "-_id")
        .exec(cb);
});

/**
 * Wrapper around Applicant.findById
 * Applicant will have bookmarkedPosts populated
 */

applicantSchema.static('findByApplicantId', function(id, cb) {
    var Applicant = this;

    Applicant.findById(id)
        .populate("bookmarkedPosts", "-_id")
        .exec(cb);
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
applicantSchema.static('findByCredentials', function findByCredentials(creds, cb) {
    var Applicant = this;
    // Look for applicant with the given email
    Applicant.findByEmail(creds.email, function findByEmailAndComparePass(err, applicant) { 
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
 * Instance method that returns the object representation
 * of an applicant while hiding sensitive information
 * @return {Object} object representation of an applicant instance
 */
applicantSchema.methods.getProfileData = function() {
    var applicant = this;
    return applicant.toObject({
        'hide': ['credentials', '_id', '__v']
        , 'transform': true 
    });
};


applicantSchema.methods.getEmail = function() {
    var applicant = this;
    return applicant.credentials.email;
};

/**
 * Export schema
 */

exports = module.exports = applicantSchema;
