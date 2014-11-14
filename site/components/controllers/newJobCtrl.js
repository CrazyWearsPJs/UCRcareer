angular.module('ucrCareerControllers')
    .controller('NewJobCtrl',['$scope', 'JobListService', 
        function newJobCtrl($scope, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               $scope.jobListingData = JobListService.getNewJob();
            });
    }]);
