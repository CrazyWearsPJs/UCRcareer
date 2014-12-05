angular.module('huntEdu.controllers')
    .controller('SearchResultsCtrl',['$scope', '$routeParams','$location', 'User','jobs', '_', 
        function ($scope, $routeParams, $location, User, jobs, _){                
                var MILLISECONDS_PER_HOUR = 3600000;
                
                var now = null,
                hourAgo = null;

                var forEach = _.forEach;

            $scope.filter = {
                selected: {
                    companyName: false,
                    state: false,
                    jobTitle: false
                },
                companyName: "",
                state: "",
                jobTitle: ""
            }; 
            

            $scope.isOwnJob = function(job) {
               return User.isOwnJob(job);  
            };
            
            $scope.isFreshJob = function(job) {
                var created = job.getCreated();
                return created > hourAgo;                
            };

            /**
             * Save a jobs as a bookmark
             */

            $scope.saveBookmark = function (){
                forEach(jobs, function(job) {
                    User.addBookmark(job)
                        .then(function(){
                            $scope.isBookmarked = true;
                        });
                });
            };

            /**
             * Remove a bookmark
             */
            $scope.showSaveBookmarkBtns = User.isLoggedIn() && (User.isApplicant());
 
            $scope.removeBookmark = function (){
                forEach(jobs, function(job) {
                    var jobId = job.getId();
                    User.removeBookmark(jobId)
                        .then(function(){
                            $scope.isBookmarked = false;
                        });
                });
            };

            $scope.jobFilter = function() {
                var filterObj = {},
                    selCompanyName = $scope.filter.selected.companyName,
                    selState = $scope.filter.selected.state,
                    selJobTitle = $scope.filter.selected.jobTitle;
                
                if(selState){
                    filterObj.location = {
                        state : $scope.filter.state
                    };
                } 

                if(selCompanyName && !selJobTitle) {
                    filterObj.specifics = {
                        companyName : $scope.filter.companyName
                    };
                } else if(selJobTitle && !selCompanyName) {
                    filterObj.specifics = {
                        jobTitle : $scope.filter.jobTitle
                    };
                } else if (selCompanyName && selJobTitle) {
                    filterObj.specifics = {
                        companyName : $scope.filter.companyName,
                        jobTitle: $scope.filter.jobTitle
                    };

                }
                return filterObj;
            };

            $scope.$on('$routeChangeSuccess', function(){
               $scope.searchResultsData = jobs;
               $scope.keyword = $routeParams.keyword;
               now = new Date();
               hourAgo = new Date(now.getTime() - MILLISECONDS_PER_HOUR);
            });

            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError' + $routeParams.keyword);
            });
    }]);
