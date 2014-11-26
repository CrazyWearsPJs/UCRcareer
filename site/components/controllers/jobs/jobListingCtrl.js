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

            $scope.hideSaveBookmarkBtn = User.isLoggedIn();

            /**
             * Save a job as a bookmark
             */

            $scope.saveBookmark = function (){
                var jobId = job.meta.id;
                var deferred = $q.defer();
                $http.post('/bookmark/add', { 'id' : jobId })
                    .then(function(){
                        deferred.resolve();
                    }, function(){
                        deferred.reject();
                    });

                return deferred.promise;
            };
    }]);
