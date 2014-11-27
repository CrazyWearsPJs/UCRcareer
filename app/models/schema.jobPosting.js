/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId
  , jobReviewSchema = require('./schema.jobReview');

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
  , reviews:          [jobReviewSchema]
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

jobPostingSchema.static('findByUrlId', function jobSearchUrlId(id, cb) {
    var JobPosting = this,
        decodedId = JobPosting.decodeUrlId(id);
   
    return JobPosting.findById(decodedId, cb);
});

jobPostingSchema.methods.encodeUrlId =  function encodeJobPostUrlId()  {  
    var jobPosting = this;
    buffer = new Buffer(jobPosting._id.toString(), 'hex');
    base64Id = buffer.toString('base64')
                    .replace('+', '-')
                    .replace('/', '_');
        
    jobPosting.meta.id = base64Id;
};

jobPostingSchema.static('decodeUrlId', function decodeJobPostUrlId(base64Id) {
    var buffer = new Buffer(base64Id.replace('-', '+').replace('_','/'), 'base64'),
        decodedId = buffer.toString('hex'),
        decodedObjectId = new ObjectId(decodedId);

    return decodedObjectId;
});

jobPostingSchema.pre('save', function beforeSavingJobPost(next) {
  var jobPosting = this;
    if(jobPosting.isNew) {
        jobPosting.encodeUrlId();
    }
    next();
});

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
