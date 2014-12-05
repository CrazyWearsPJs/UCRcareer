/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var ObjectIdBase64Conv = require('../util').ObjectIdBase64Conv
  , objectIdToBase64 = ObjectIdBase64Conv.objectIdToBase64;

/**
 * Define job review schema
 */

var jobReviewSchema = new Schema({
   meta: {
        id: {type: String}      
    }
  , timestamps: {
        created: {type: Date, default: Date.now, required: true},
        lastModified: {type: Date, default: Date.now, required: true}
    }
  , reviewer: {type: Schema.Types.ObjectId, ref: 'Applicant', required: true}
  , content: {
        title:  {type: String, required: true},
        body:   {type: String, required: true},
        rating: {type: Number, required: true}
  }
}); 

jobReviewSchema.pre('save', function(next) {
    var jobReview = this;
    
    if(jobReview.isNew) {
        jobReview.meta.id = objectIdToBase64(jobReview._id);
    } else {
        // new Date() represents Date.now as a Date Object
        jobReview.timestamps.lastModified = new Date();
        jobReview.markModified('timestamps.lastModified');
    }
    next();
});

/**
 * Export schema
 */
 
exports = module.exports = jobReviewSchema;
