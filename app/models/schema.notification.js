/**
 * Module dependancies
 */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;


/**
 * Define notification schema
 */

var notificationSchema = new Schema({
    message: { type: String, required: true }
  , meta: {
        jobPost: { type: Schema.Types.ObjectId, ref: 'JobPosting' }
    }
});

/**
 * Export schema
 */

exports = module.exports = notificationSchema;