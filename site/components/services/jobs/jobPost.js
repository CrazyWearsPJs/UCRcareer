angular.module('huntEdu.services')
    .factory('JobPost', ['$http', '$q', '_', 'Util', function JobPostFactory($http, $q, _, Util) {
        var forEach = _.forEach,
            isArray = _.isArray,
            pick = _.pick,
            uniq = _.uniq,
            compactObject = Util.compactObject,
            compactObjectDeep = Util.compactObjectDeep;

        var JOB_POST_DATA_FIELDS = ['meta','specifics', 'location', 
                            'date', 'media', 'tags', 'timestamps'];
        
        function baseSetJobPostData(data, context) {
            var relevantData = pick(data, JOB_POST_DATA_FIELDS),
                compactData = compactObject(relevantData);

            forEach(compactData, function(val, key) {
                if(isArray(val)) {
                    context[key] = uniq(val);
                } else {
                    context[key] = val;
                }

            });
        }

        /**
         * Constructor for Job Post. Initializes Job Post given
         * data. 
         * @param data {Object} 
         */

        function JobPost(data) {
           baseSetJobPostData(data, this);
        }

        JobPost.prototype = {
            'timestamps': {
                'created': null,
                'lastModified': null
            },
            'meta': {
                'id': null
            },
            'specifics': {
                'jobTitle': null, 
                'description': null, 
                'requirements': null, 
                'salary': null,
                'companyName': null,
                'department': null,
                'jobType': null
            },
            'location': {
                'city': null,
                'state': null
            },
            'date': {
                'postedOn': null,
                'endsOn': null
            }, 
            'media': {
                'image': null,
                'video': null
            },
            'tags': []
        };

        JobPost.prototype.getId = function() {
            return this.meta.id;
        };

        JobPost.prototype.getCreated = function() {
            return new Date(this.timestamps.created);
        };

        JobPost.prototype.isIn = function(posts) {
            var id = this.getId(),
                found = false;
            
            forEach(posts, function(post) {
                if(post.getId() === id) {
                    found = true;
                    return false;
                }
            });

            return found;
        };

        JobPost.getJobPostDataFields = function() {
            return JOB_POST_DATA_FIELDS;
        };

        JobPost.prototype.getImage = function() {
            return this.media.image;
        };

        JobPost.prototype.hasImage = function() {
            return !!this.media.image;
        };

        JobPost.prototype.getVideo = function() {
            return this.media.video;
        };
        
        JobPost.prototype.hasVideo = function() {
            return !!this.media.video;
        };

        JobPost.prototype.setJobPostData = function(data) {
            baseSetJobPostData(data, this);
        };

        JobPost.prototype.getJobPostData = function() {
            return compactObjectDeep(this);
        };
        
         return JobPost;
    }]);
