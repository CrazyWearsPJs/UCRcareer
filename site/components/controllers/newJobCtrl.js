angular.module('ucrCareerControllers')
    .controller('NewJobCtrl',['$scope', '$location', 'JobListService', 
        function newJobCtrl($scope, $location, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               var job = JobListService.getNewJob();
               if(!job) {
                    $location.path('/jobPosting');
               }
               $scope.jobListingData = job;
               $scope.hasVideo = job.hasVideo();
               $scope.hasImage = job.hasImage();
            });
    }]);
