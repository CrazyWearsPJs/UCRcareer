/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema 
  , JobReviewSchema = require('./schema.jobReview');

var ObjectIdBase64Conv = require('./util').ObjectIdBase64Conv
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
  }
  , tags:             [ String ]
  , reviews:          [JobReviewSchema]
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

jobPostingSchema.static('findByKeyword', function jobSearch(keyword, cb, options){
    var jobPosting = this;
    
    var limit = 100;

    // Sanity checking
    if (!keyword)
        return cb(new Error("Keyword was not provided"));
    if (typeof keyword !== "string")
        return cb(new Error("Keyword was not a string"));
    
    if(options) {
        if(options.limit) {
            limit = options.limit;
        }
    }

    jobPosting.find(
        {$text: {$search: keyword }},
        {score : {$meta: "textScore"}}
     )
     .sort({score: {$meta: "textScore"} 
     })
     .limit(limit)
     .populate('reviews')
     .exec(cb);
});

jobPostingSchema.static('findByUrlId', function jobSearchUrlId(b64Id, cb) {
    var JobPosting = this,
        _id = null;

    try {
        _id = base64ToObjectId(b64Id);
        return JobPosting.findById(_id, cb);
    } catch(err) {
        err.status = 400;
        cb(err);
    }
});

jobPostingSchema.pre('save', function beforeSavingJobPost(next) {
  var jobPosting = this;
    if(jobPosting.isNew) {
        jobPosting.meta.id = objectIdToBase64(jobPosting._id);
    }
    next();
});


/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
