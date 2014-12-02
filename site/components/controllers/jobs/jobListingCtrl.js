angular.module('huntEdu.controllers')
    .controller('JobListingCtrl',['$scope', '$location', '$http', '$q', 'User', 'USER_ROLES', 'job', 
        function ($scope, $location, $http, $q, User, USER_ROLES, job){
            
            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError');
            });

            $scope.$on('$routeChangeSuccess', function(){
                $scope.jobListingData = job;
                $scope.hasVideo = job.hasVideo();
                $scope.hasImage = job.hasImage();
            });

            $scope.showSaveBookmarkBtns = User.isLoggedIn() && (User.getUserRole() === USER_ROLES.applicant);
            $scope.isBookmarked = User.hasBookmark(job.meta.id);

            *$scope.reviewData = job.reviews;

            
            $scope.showLoggedIn = function() {
                return User.isLoggedIn();
            };

            /* Star Ratings */
            $scope.rate = 0;
            $scope.max = 5;
            $scope.isReadonly = true;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            }; 
            
            /**
             * Save a job as a bookmark
             */

            $scope.saveBookmark = function (){
                var jobId = job.meta.id;
                User.addBookmark(jobId)
                    .then(function(){
                        $scope.isBookmarked = true;
                    });
            };

            /**
             * Remove a bookmark
             */

            $scope.removeBookmark = function (){
                var jobId = job.meta.id;
                User.removeBookmark(jobId)
                    .then(function(){
                        $scope.isBookmarked = false;
                    });
            };
    }]);
