angular.module('huntEdu.controllers')
    .controller('JobListingCtrl',['$scope', '$location', 'job', 
        function ($scope, $location, job){
            
            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError');
            });

             $scope.$on('$routeChangeSuccess', function(){
                    $scope.jobListingData = job;
                    $scope.hasVideo = job.hasVideo();
                    $scope.hasImage = job.hasImage();
            });
    }]);
