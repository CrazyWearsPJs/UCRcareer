angular.module('ucrCareerServices')
    .factory('JobListService', ['$http', '$q', 'JobPost', 'User', 
    function JobListService($http, $q, JobPost, User) {
        
        var forEach = angular.forEach;

        var JobList = {
            'jobs': {}
        };

        JobList.push = function(query, job) {
            JobList.jobs[query].list.push(job);
        };

        JobList.getResults = function(query) {
            return JobList.jobs[query].list;
        };

        JobList.getAll = function() {
            return JobList.jobs;
        };

        JobList.insert = function(query, job, index) {
            JobList.jobs.splice(index, 0, job);
        };

        JobList.remove = function(query, index) {
            JobList.jobs.splice(index, 1);
        };

        JobList.pop = function(query) {
            JobList.jobs[query].list.pop();
        };

        JobList.queryCached = function(query) {
            return JobList.jobs.hasOwnProperty(query);
        };

        JobList.at = function(query, index) {
            return JobList.jobs[query].list[index];
        };

        JobList.queryList = function() {
            var list = [];
            forEach(JobList.jobs, function(value, key){
                list.push(key);   
            });
            return list;
        };

        JobList.clearResults = function(query) {
            if(JobList.queryCached(query)){
                delete JobList.jobs[query];
            }
        };

        JobList.clearAll = function() {
            JobList.queries = [];
            JobList.jobs = {};
        };
        
        JobList.search = function(keyword, limit) {
            var deferred = $q.defer();

            limit = limit || 100;

            if(JobList.queryCached(keyword)) {
                deferred.resolve(JobList.getResults(keyword));
                return deferred.promise;  
            }
             
            $http.get('/search' + '/' + keyword)
                .then(function(res) {
                    var results = res.data,
                        count = 0;
                    JobList.jobs[keyword] = {
                        "list" : []
                    };

                    forEach(results, function(result){
                        if(count < limit) {
                            JobList.push(keyword, new JobPost(result));
                        }
                        count += 1;
                    });
                    
                    deferred.resolve(JobList.getResults(keyword));
                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        JobList.setNewJob = function(job) {
            JobList.newJob = job;
        };

        JobList.getNewJob = function() {
            return JobList.newJob;
        };

        JobList.getRecommendedJobs = function() {
             var deferred = $q.defer(),
                keyword = User.getMajor(),
                limit = 3;

             JobList.search(keyword, limit)
                .then(function() {
                    deferred.resolve(JobList.getResults(keyword));
                }, deferred.reject);
             
             return deferred.promise;
        };

        JobList.atRecommendedJobs = function(index) {
            var keyword = User.getMajor();
            return JobList.at(keyword, index);
        };

        return JobList;
    }]);
