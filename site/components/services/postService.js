angular.module('ucrCareerServices')
    .service('PostService', ['$http', '$q', 'User', function PostService($http, $q, User){

        this.postJob = function(job) {
            var deferred = $q.defer(),
                jobPostingRoutePrefix = '/post',
                jobPostData = job.getJobPostData();
                
                if(!jobPostData || !User.isEmployer()) {
                    deferred.reject();
                    return deferred.promise; 
                }
                $http.post(jobPostingRoutePrefix, jobPostData)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
