/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;


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
}); 

/**
 * Search for job postings based on a keyword. Keyword
 * could be contained in job description OR job title
 * @param keyword {String} 
 * @param cb {Function} callback
 * callback(err, [post1, post2...])
 */

jobPostingSchema.static('findByKeyword', function jobSearch(keyword, cb){
    var jobPosting = this;
    
    // Sanity checking
    if (!keyword)
        return cb(new Error("Keyword was not provided"));
    if (typeof keyword !== "string")
        return cb(new Error("Keyword was not a string"));
    
    var keywordRegex = new RegExp(".*" + keyword + ".*", "i");
    
    jobPosting.find({ 
        $or :[
            {'specifics.jobTitle': keywordRegex}
          , {'specifics.description': keywordRegex}
        ]}
      , cb);
});

jobPostingSchema.static('encodeUrlId',  function encodeJobPostUrlId(_id)  {  
    var jobPosting = this;
    buffer = new Buffer(_id, 'hex');
    base64Id = buffer.toString('base64')
                    .replace('+', '-')
                    .replace('/', '_');
        
    return base64Id;
});

jobPostingSchema.static('decodeUrlId', function decodeJobPostUrlId(base64Id) {
    var buffer = new Buffer(base64Id.replace('-', '+').replace('_','/'), 'base64'),
        decodedId = buffer.toString('hex'),
        decodedObjectId = new ObjectId(decodedId);

    return decodedObjectId;
});

jobPostingSchema.pre('save', function beforeSavingJobPost(next) {
  var jobPosting = this;
    if(jobPosting.isNew) {
        var _id = jobPosting._id.toString();
        jobPosting = jobPosting.encodeUrlId(_id);
    }
    next();
});

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
