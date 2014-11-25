angular.module('huntEdu.services')
    .service('SearchService', ['$http', '$q', '_', 'JobList', 'User',  
    function searchService($http, $q, _, JobList, User) {

        var forEach = _.forEach,
            isEmpty = _.isEmpty;

        /**
         * Populate JobList service with jobs containing keyword, then
         * return the results. 
         * @param keyword {String} search keyword
         * @param limit {Integer} max number of results
         * @return [Job1, Job2, ...]
         */

        this.search = function(keyword, limit) {
            var deferred = $q.defer();

            limit = limit || 100;

            if(JobList.hasResults(keyword)) {
                deferred.resolve(JobList.getResults(keyword));
                return deferred.promise;  
            }
             
            $http.get('/search' + '/' + keyword)
                .then(function(res) {
                    var jobPostsRaw = res.data,
                        count = 0;
                    forEach(jobPostsRaw, function(jobPostRaw){
                        if(count < limit) {
                            JobList.addJob(jobPostRaw, keyword);
                        }
                        count += 1;
                    });
                    
                    deferred.resolve(JobList.getResults(keyword));
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
                }, deferred.reject);
             
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
                    console.log(jobs);
                    deferred.resolve(jobs);
                }, deferred.reject);
             
             return deferred.promise;

        };

        this.findJobById = function(id) {
            var deferred = $q.defer();

            if(JobList.hasJob(id)) {
                deferred.resolve(JobList.getJobById(id));
            } else {
                $http.get('/post/id/' + id)
                    .then(function(res) {
                        var jobPostRaw = res.data;
                        JobList.addJob(jobPostRaw);
                        deferred.resolve(JobList.getJobById(jobPostRaw.meta.id));
                    }, deferred.reject);
           }
           return deferred.promise;
        };

    }]);
