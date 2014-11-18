angular.module('ucrCareerControllers')
    .controller('SearchResultsCtrl',['$scope', '$location', 'jobs', 
        function ($scope, $location, jobs){
            $scope.$on('$routeChangeSuccess', function(){
               $scope.searchResultsData = jobs;
            });

            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError');
            });
    }]);
