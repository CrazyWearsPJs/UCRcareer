/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Define job posting schema
 */

var jobPostingSchema = new Schema({
    specifics: {
        jobTitle:     { type: String, required: true }
      , description:  { type: String, required: true }
      , requirements: { type: String, required: true }
      , salary:       { type: String, required: true }
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

/**
 * Export schema
 */

exports = module.exports = jobPostingSchema;
