angular.module('ucrCareerControllers')
    .controller('JobListingCtrl',['$scope', '$routeParams', 'JobListService', 
        function JobListingCtrl($scope, $routeParams, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               var keyword = $routeParams.keyword,
                   index = $routeParams.index,
                   job = JobListService.at(keyword, index);
               $scope.jobListingData = job;
               $scope.hasVideo = job.hasVideo();
               $scope.hasImage = job.hasImage();
            });
    }]);
