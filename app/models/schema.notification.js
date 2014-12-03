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
        jobPost: { type: Schema.Types.ObjectId }
    }
});

/**
 * Export schema
 */

exports = module.exports = notificationSchema;