/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , _        = require('lodash')
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
  , subscription: { 
        expires:       { type: Date, default: '1/1/1970' }
  }
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


applicantSchema.methods.isSubscribed = function() {
    var applicant = this,
        now = new Date();
    return applicant.subscription.expires >= now;
};


var MILLISECONDS_PER_DAY = 86400000;
applicantSchema.methods.addSubscriptionDays = function(days, cb) {
    var applicant = this,
        now = new Date(),
        daysToMilliSeconds = days * MILLISECONDS_PER_DAY;
    
    if(applicant.subscription.expires < now) {
        applicant.subscription.expires.setTime(now.getTime() + daysToMilliSeconds);
    } else {
        //extending membership
        var curExpTime = applicant.subscription.expires.getTime();
        applicant.subscription.expires.setTime(curExpTime + daysToMilliSeconds);
    }

    applicant.markModified('subscription.expires');
    applicant.save(cb);
};

/**
 * Returns index of job post in bookmarks list if it exists 
 * @param postid {ObjectID} job posting id
 * @return {Integer} position of job posting in bookmarked posts. -1 if
 *                   not found
 */

applicantSchema.methods.bookmarkIndex = function(postId){
    var applicant = this;
    
    // Create a copy of applicants bookmarked posts as strings
    // This needs to be done because ObjectIds cannot be compared to 
    // each other directly
    var _bookmarkedPosts = _.map(applicant.bookmarkedPosts, function(objId){
        return String(objId);
    });

    return _.indexOf(_bookmarkedPosts, String(postId));
}

/**
 * Adds a job posting id to applicant's bookmarked posts
 * @param postId {ObjectId} Job posting id
 * @param cb {Function} callback
 */

applicantSchema.methods.addBookmark = function(postId, cb){
    var applicant = this;
    
    // If applicant has bookmark already, do nothing
    if (applicant.bookmarkIndex(postId) !== -1)
        return cb (null);

    applicant.bookmarkedPosts.push(postId);
    applicant.save(cb);
};

/**
 * Removes a job posting id from the applicant's bookmarked posts
 * @param postId {ObjectId} Job posting id
 * @param cb {Function} callback
 */

applicantSchema.methods.removeBookmark = function(postId, cb){
    var applicant = this;

    // Figure out where the id to remove is located
    var removalPoint = applicant.bookmarkIndex(postId);

    // If bookmark doesn't exist, then there is nothing to do!
    if ( removalPoint === -1){
        return cb(null);
    }

    applicant.bookmarkedPosts.splice(removalPoint, 1);
    applicant.save(cb);
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
        .populate("bookmarkedPosts", "-_id -__v")
        .exec(cb);
});

/**
 * Wrapper around Applicant.findById
 * Applicant will have bookmarkedPosts populated
 */

applicantSchema.static('findByApplicantId', function(id, cb) {
    var Applicant = this;

    Applicant.findById(id)
        .populate("bookmarkedPosts", "-_id -__v")
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
