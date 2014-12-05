angular.module('huntEdu.services')
    .service('SearchService', ['$http', '$q', '_', 'JobPost', 'User',  
    function searchService($http, $q, _, JobPost, User) {

        var forEach = _.forEach,
            isEmpty = _.isEmpty;

        /**
         * Returns search results with jobs containing keyword, then
         * return the results. 
         * @param keyword {String} search keyword
         * @param limit {Integer} max number of results
         * @return [Job1, Job2, ...]
         */

        this.search = function(keyword, limit) {
            var deferred = $q.defer();

            limit = limit || 100;

            $http.get('/search' + '/' + keyword)
                .then(function(res) {
                    var jobPostsRaw = res.data,
                        count = 0,
                        jobs = [],
                        job = null;
                    forEach(jobPostsRaw, function(jobPostRaw){
                        if(count < limit) {
                            job = new JobPost(jobPostRaw);
                            if(job) {
                                jobs.push(job);
                            }
                        }
                        count += 1;
                    });
                    
                    deferred.resolve(jobs);

                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        this.getRecommendedFocusJobs = function() {
             var deferred = $q.defer(),
                keyword = User.getMajor(),
                limit = 3;

             if(!keyword) {
                deferred.resolve([]);
                return deferred.promise;
             }

             this.search(keyword, limit)
                .then(function(jobs) {
                    deferred.resolve(jobs);
                }, function() {
                    deferred.resolve([]);   
                });
             
             return deferred.promise;
        };

        this.getRecommendedInterestJobs = function() {
            var deferred = $q.defer(),
                interests = User.getInterests(),
                limit = 3;

             if(isEmpty(interests)) {
                deferred.resolve([]);
                return deferred.promise;
             }

             var interestsStr = interests.join(" ");

             this.search(interestsStr, limit)
                .then(function(jobs) {
                    deferred.resolve(jobs);
                }, function() {
                    deferred.resolve([]);   
                });
             
             return deferred.promise;

        };

        this.findJobById = function(id) {
            var deferred = $q.defer();

            $http.get('/post/id/' + id)
                .then(function(res) {
                    var jobPostRaw = res.data, 
                        job = null;

                    job = new JobPost(jobPostRaw);
                    
                    deferred.resolve(job);
                }, deferred.reject);
           return deferred.promise;
        };
    
    }]);
