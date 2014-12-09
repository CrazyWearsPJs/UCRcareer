angular.module('huntEdu.controllers')
    .controller('SearchResultsCtrl',['$scope', '$routeParams','$location', 'User','jobs', '_', 
        function ($scope, $routeParams, $location, User, jobs, _){                
                var MILLISECONDS_PER_HOUR = 3600000;
                
                var now = null,
                hourAgo = null;

                var forEach = _.forEach,
                    pick = _.pick;

            $scope.filter = {
                selected: {
                    companyName: false,
                    state: false,
                    jobTitle: false, 
                    city: false,
                    jobType: false
                },
                companyName: "",
                state: "",
                jobTitle: "",
                city: "",
                jobType: ""
            }; 
            

            $scope.isOwnJob = function(job) {
               return User.isOwnJob(job);  
            };
            
            $scope.isFreshJob = function(job) {
                var created = job.getCreated();
                return created > hourAgo;                
            };

            /**
             * Save search
             */

            $scope.saveSearch = function (){
                forEach(jobs, function(job) {
                    User.addBookmark(job)
                        .then(function(){
                            $scope.isBookmarked = true;
                        });
                });
            };

            /**
             * Remove a search
             */
            $scope.showSaveSearchBtns = User.isLoggedIn() && (User.isApplicant());
 
            $scope.removeSearch = function (){
                forEach(jobs, function(job) {
                    var jobId = job.getId();
                    User.removeBookmark(jobId)
                        .then(function(){
                            $scope.isBookmarked = false;
                        });
                });
            };

            $scope.searchFilterObj = function() {
                return pick($scope.filter, function(value, key) {
                    return typeof value === "string" && $scope.filter.selected[key] &&
                        value !== "";  
                });
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
