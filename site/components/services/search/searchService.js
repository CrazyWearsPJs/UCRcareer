angular.module('huntEdu.services')
    .service('SearchService', ['$http', '$q', 'JobList', 'User',  
    function searchService($http, $q, JobList, User) {

        var forEach = angular.forEach;

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

        this.getRecommendedJobs = function() {
             var deferred = $q.defer(),
                keyword = User.getMajor(),
                limit = 3;

             if(!keyword) {
                deferred.reject();
                return deferred.promise;
             }

             this.search(keyword, limit)
                .then(function(jobs) {
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
