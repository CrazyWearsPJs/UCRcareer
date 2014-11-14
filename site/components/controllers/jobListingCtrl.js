angular.module('ucrCareerControllers')
    .controller('JobListingCtrl',['$scope', '$routeParams', 'JobListService', 
        function JobListingCtrl($scope, $routeParams, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               var keyword = $routeParams.keyword,
                   index = $routeParams.index;
               $scope.jobListingData = JobListService.at(keyword, index);
            });
    }]);
