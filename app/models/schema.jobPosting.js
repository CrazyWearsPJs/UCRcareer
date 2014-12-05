/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema 
  , JobReviewSchema = require('./schema.jobReview')
  , _ = require('lodash');


var ObjectIdBase64Conv = require('../util').ObjectIdBase64Conv
  , objectIdToBase64 = ObjectIdBase64Conv.objectIdToBase64
  , base64ToObjectId = ObjectIdBase64Conv.base64ToObjectId;

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
      , companyName:  { type: String, required: true }
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
  , media: {
        image:        { type: String }
      , video:        { type: String }
    }
  , meta: {
        id:           { type: String }
  },
  timestamps: {
        created: { type: Date, default: Date.now, required: true},
        lastModified: { type: Date, default: Date.now, require: true}

  }
  , tags:             [ String ]
  , reviews:          [JobReviewSchema]
  , poster: {type: Schema.Types.ObjectId, ref: 'Employer'} 
}); 

var textSearchIndexFields = {
    "specifics.jobTitle": "text",
    "specifics.description": "text",
    "specifics.requirements": "text",
    "specifics.companyName": "text",
    "specifics.jobType": "text",
    "specifics.location": "text",
    "tags": "text"
},
    textSearchIndexOptions = {
    "name": "text_search_index",
    "weights": {
        "specifics.jobTitle": 4,
        "specifics.description": 1,
        "specifics.requirements": 1,
        "specifics.companyName": 5,
        "specifics.jobType": 4,
        "specifics.location": 4,
        "tags": 6
    }
};

jobPostingSchema.index(textSearchIndexFields, textSearchIndexOptions);

/**
 * Search for job postings based on a keyword. Keyword
 * could be contained in job description OR job title
 * @param keyword {String} 
 * @param cb {Function} callback
 * callback(err, [post1, post2...])
 */



var MILLISECONDS_PER_HOUR = 3600000;

jobPostingSchema.static('findByKeyword', function jobSearch(keyword, cb, options){
    var jobPosting = this;
    
    var limit = 100, 
        delay = 1; // delay is in hours

    // Sanity checking
    if (!keyword)
        return cb(new Error("Keyword was not provided"));
    if (typeof keyword !== "string")
        return cb(new Error("Keyword was not a string"));
    
    if(options) {
        if(options.limit) {
            limit = options.limit;
        }
        
        if(options.delay) {
            delay = options.delay;
        }
    }
    

    var baseQuery = jobPosting.find(
            {$text: {$search: keyword }},
            {score : {$meta: "textScore"}}
        )
        .sort({score: {$meta: "textScore"} 
        })
        .limit(limit);

     var finalQuery = null;

     if(options && options.showAllJobs) {
        //If showAllJobs, then this is probably a subscribed applicant
        //don't filter any information
        finalQuery = baseQuery;
     } else {
        // If not showAllJobs, then this is a non-subscribed user,
        // only show posts that are at least delay*hours old
        var delayHoursFromNow = new Date(Date.now() - (delay * MILLISECONDS_PER_HOUR));
        if(options && !_.isEmpty(options.ownJobs)) {
            // this is the case where an employer searches using a keyword
            // and expects his own posted job to be a part of the search results
            //
            // so, we narrow down the search results to jobs that
            // are older than delay*hour, or jobs that this employer has posted himself
            finalQuery = baseQuery.or([{'timestamps.created': {$lte: delayHoursFromNow}}, {
                                        '_id': {$in: options.ownJobs}
 
                }]);
        } else {
            // otherwise is a guest or an unpaid applicant, who can only see 
            // jobs that are older than an hour
            finalQuery = baseQuery.where('timestamps.created').lte(delayHoursFromNow);
        }
     }

     //execute the query
     finalQuery.populate('reviews').exec(cb);
     
});

jobPostingSchema.static('findAndPopulateReviewsById', function jobSearch(id, cb) {
    var JobPosting = this;

    return JobPosting.findById(id).populate('reviews').exec(function(err, job){
        if(!err && job) {   
            JobPosting.populate(job, { path: 'reviews.reviewer', select:'credentials.email'}, cb);
        } else {
            cb(err, null)
        }
    });
});

jobPostingSchema.static('findByUrlId', function jobSearchUrlId(b64Id, cb) {
    var JobPosting = this,
        _id = null;

    try {
        _id = base64ToObjectId(b64Id);
        return JobPosting.findAndPopulateReviewsById(_id, cb);
    } catch(err) {
        err.status = 400;
        cb(err);
    }
});

jobPostingSchema.methods.getReviewByUrlId = function reviewSearchUrlId(reviewB64Id) {
    var jobPosting = this,
        review_id = null;

    try {
        review_id = base64ToObjectId(reviewB64Id);
        return jobPosting.reviews.id(review_id);
    } catch(err) {
        return null;    
    }
};

jobPostingSchema.pre('save', function beforeSavingJobPost(next) {
  var jobPosting = this;
    if(jobPosting.isNew) {
        jobPosting.meta.id = objectIdToBase64(jobPosting._id);
    } else {
        jobPosting.timestamps.lastModified = new Date();
        jobPosting.markModified('timestamps.lastModified');
    }
    next();
});

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
