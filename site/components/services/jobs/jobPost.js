angular.module('huntEdu.services')
    .factory('JobPost', ['$http', '$q', '_', 'Util', function JobPostFactory($http, $q, _, Util) {
        var forEach = _.forEach,
            isArray = _.isArray,
            pick = _.pick,
            uniq = _.uniq,
            compactObject = Util.compactObject,
            compactObjectDeep = Util.compactObjectDeep,
            diffObject = Util.diffObject;

        var JOB_POST_DATA_FIELDS = ['meta','specifics', 'location', 
                            'date', 'media', 'tags'];
        
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


        var updatedJobPostData = function(data) {
            var compactData = compactObjectDeep(data),
                diffData = diffObject(compactData, JobPost.prototype);
            return pick(diffData, JobPost.prototype);
        };
       


        //TODO When I'm sending data, I'm not saying which element to overwrite
        //Need to include the meta.id somehow 
        JobPost.prototype.updateJobPost = function(data) {
            var deferred = $q.defer();
            var updatedData = updatedJobPostData(data);

            console.log("Sending Data:", updatedData);

            $http.post('/post', updatedData)
                .then(function(res) {
                    var updatedDataRes = res.data;
                    console.log(updatedDataRes);
                    JobPost.prototype.setJobPostData(updatedDataRes);
                    deferred.resolve(res);
                }, function(err) {
                    deferred.reject(err);
                });
             return JobPost.prototype;
        };
        
        JobPost.prototype.getId = function() {
            return this.meta.id;
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
