angular.module('huntEdu.services')
    .service('PostService', ['$http', '$q', 'User', function PostService($http, $q, User){
        var jobPostingRoutePrefix = '/post';
        
        var PostingService = this;

        PostingService.postJob = function(job, path) {
            var deferred = $q.defer(),
               jobPostData = job.getJobPostData();
            
            console.log(jobPostData);
            path = path || jobPostingRoutePrefix;
                
            if(!jobPostData || !User.isEmployer()) {
                deferred.reject();
                return deferred.promise; 
            }

            $http.post(path, jobPostData)
            .then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        PostingService.updateJob = function(job) {
            var id = job.getId();
            return PostingService.postJob(job, jobPostingRoutePrefix + "/id/" + id);    
        };
    }]);
