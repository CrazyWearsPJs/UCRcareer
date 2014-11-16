angular.module('ucrCareerControllers')
    .controller('HomeCtrl',['$scope', '$location', 'User', 'JobListService',
        function homeCtrl($scope, $location, User, JobListService){
            $scope.$on('$viewContentLoaded', function(){
               var keyword = null;

               if(!User.isApplicant()) {
                    $location.path('/');       
               } else {
                    keyword = User.getMajor();
                    $scope.keyword = keyword;
                    $scope.jobs = JobListService.getResults(keyword);
                    if(!$scope.jobs) {
                        $location.path('/');    
                    }
                    
               }
            });
    }]);
