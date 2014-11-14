angular.module('ucrCareerControllers')
    .controller('SearchResultsCtrl',['$scope', '$routeParams', 'JobListService', 
        function ($scope, $routeParams, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               var keyword = $routeParams.keyword,
                   jobs = JobListService.getResults(keyword);
               $scope.keyword = keyword;
               $scope.searchResultsData = jobs;
            });
    }]);
