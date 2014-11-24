angular.module('huntEdu.controllers')
    .controller('NewJobCtrl',['$scope', '$location', 'JobList', 
        function newJobCtrl($scope, $location, JobList){
            $scope.$on('$viewContentLoaded', function(){
               var job = JobList.getNewJob();
               if(!job) {
                    $location.path('/jobPosting');
               }
               $scope.jobListingData = job;
               $scope.hasVideo = job.hasVideo();
               $scope.hasImage = job.hasImage();
            });
    }]);
