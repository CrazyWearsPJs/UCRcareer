(function(){
    
    'use strict';

    /**
     * Post Service
     */
    
    function PostService($http, $q, User){
        var authTokenSuffix = 'api-token',
            extend = angular.extend;
        
        var forEach = angular.forEach,
            isFunction = angular.isFunction,
            isObject = angular.isObject,
            copy = angular.copy;

        var copyNonNull = function(src, dest) {
            if(dest) {
                copy(src, dest);
            } else {
                dest = copy(src); 
            }

            if(isObject(dest)) {
                forEach(dest, function(value, key) {
                    if(!value) {
                        delete dest[key];
                    }
                });
            }
            return dest;
        };

        var JOB_POST_DATA_FIELDS = {};

        JOB_POST_DATA_FIELDS[USER_ROLES.employer] = ['specifics', 'location', 'date'];
        
        var jobPostData = JOB_POST_DATA_FIELDS[USER_ROLES.employer];

        var Post = {
            'specifics': {
                'jobTitle': null, 
                'description': null, 
                'requirements': null, 
                'salary': null, 
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
            } 
        };

        var getJobPostDataFields = function() {
            return jobPostData;
        };

        Post.setJobPostData = function(data) {
            var jobPostDataFields = getjobPostDataFields();

            forEach(data, function(value, key) {
                if(profileDataFields.indexOf(key) !== -1) {
                    Post[key] = copyNonNull(data[key]);
                }
            });
        };

        Post.getJobPostingData = function() {
            var info = {},
                jobPostDataFields = getJobPostDataFields();
            
            forEach(Post, function(value, key) {
                forEach(jobPostDataFields, function(jobPostDataField) {
                    if(value && (key === jobPostDataField)) {
                        info[jobPostDataField] = 
                            copyNonNull(value);
                    }
                });  
            });
            return info;
        };
        
        this.post = function() {
            var deferred = $q.defer(),
                jobPostingRoutePrefix = '/post',
                jobPostingData = extend(Post.getJobPostingData()); // TODO create the get posting data function for users!!!
            $http.post(jobPostingRoutePrefix, jobPostingData)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }
    
    /**
     * Register functions
     */

    angular.module('ucrCareerServices')
        .service('PostService', 
            [
                 '$http'
               , '$q'
               , 'User'
               , PostService
            ]);

})();
