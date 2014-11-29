angular.module('huntEdu.controllers')
    .controller('JobListingCtrl',['$scope', '$location', '$http', '$q', 'User', 'job', 
        function ($scope, $location, $http, $q, User, job){
            
            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError');
            });

            $scope.$on('$routeChangeSuccess', function(){
                $scope.jobListingData = job;
                $scope.hasVideo = job.hasVideo();
                $scope.hasImage = job.hasImage();
            });

            $scope.hideSaveBookmarkBtns = User.isLoggedIn();
            $scope.isBookmarked = User.hasBookmark(job.meta.id);

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
