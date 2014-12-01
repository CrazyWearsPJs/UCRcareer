var ObjectId = require('mongoose').Types.ObjectId; 

var ObjectIdBase64Conv = {};

ObjectIdBase64Conv.objectIdToBase64 = function(objId) {
    var objIdStr = objId.toString(),
        buffer = new Buffer(objIdStr, 'hex'),
        b64Str = buffer.toString('base64')
                    .replace('+', '-')
                    .replace('/', '_');
    return b64Str;
};

ObjectIdBase64Conv.base64ToObjectId = function(b64str) {
    var replacedB64Str = b64str.replace('-', '+').replace('_', '/'),
        buffer = new Buffer(replacedB64Str, 'base64'),
        decodedIdStr = buffer.toString('hex'),
        objId = new ObjectId(decodedIdStr);

    return objId;
};

exports = module.exports = ObjectIdBase64Conv;
