angular.module('ucrCareerServices')
    .factory('JobListService', [ function JobListService() {
        
        var JobList = {
            'jobs': []
        };

        JobList.push = function(job) {
            JobList.jobs.push(job);
        };

        JobList.getAll = function() {
            return JobList.jobs;
        };

        JobList.insert = function(index, job) {
            JobList.jobs.splice(index, 0, job);
        };

        JobList.remove = function(index) {
            JobList.jobs.splice(index, 1);
        };

        JobList.pop = function() {
            JobList.jobs.pop();
        };

        JobList.at = function(index) {
            return JobList.jobs[index];
        };
        
        return JobList;
    }]);
