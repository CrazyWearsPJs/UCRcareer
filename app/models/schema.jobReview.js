/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;


/**
 * Define job posting schema
 */
var jobReviewSchema = new Schema({
    timestamps: {
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

exports = module.exports = jobReviewSchema;
