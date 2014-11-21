angular.module('huntEdu.services')
    .factory('JobList', ['JobPost', 
    function JobListFactory(JobPost) {

        var forEach = angular.forEach;

        var JobList = {
            'searchResults': {}, //map of search queries to ordered array of ids 
            'jobs': {},    // map of job ids to jobs
            'newJob': null        
            };

        JobList.getJobById = function(id) { 
            if(this.jobs.hasOwnProperty(id)) {
                return this.jobs[id];
            } 
            return null;
        };

        JobList.hasJob = function(id) {
            return !!this.getJobById(id);  
        };

        JobList.hasResults = function(keyword) {
            return this.searchResults.hasOwnProperty(keyword);
        };

        JobList.addJob = function(jobData, keyword) {
            
            if(!jobData) {
                return;
            }

            var job = new JobPost(jobData),
                id = job.getId();

            if(!id) {
                return;
            }

            if(keyword) {
                if(this.hasResults(keyword)) {
                    this.searchResults[keyword].push(id);
                } else {
                    this.searchResults[keyword] = [id];
                }
            }

            this.jobs[id] = job;
        };

        JobList.getResults = function(keyword) {
            var self = this,
                res = [],
                job = null;

            if(self.searchResults.hasOwnProperty(keyword)) {
                forEach(self.searchResults[keyword], function(id){
                    job = self.getJobById(id);
                    if(job) {
                        res.push(job);
                    }
                });
                return res;
            }
            return null;
        };
        
        JobList.clearAll = function() {
            this.searchResults = {};
            this.jobs = {};
        };

        JobList.setNewJob = function(jobPostRaw) {
            var job = new JobPost(jobPostRaw);
            if(job) {
                this.newJob = job;
            }
        };

        JobList.getNewJob = function() {
            return this.newJob;
        };
        
        return JobList;
    }]);
