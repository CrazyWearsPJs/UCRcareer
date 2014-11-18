angular.module('huntEdu.controllers')
    .controller('HomeCtrl',['$scope', '$location', 'User', 'jobs',
        function homeCtrl($scope, $location, User, jobs){
            $scope.$on('$routeChangeSuccess', function(){
               var keyword = null;

               if(!User.isApplicant()) {
                    $location.path('/');       
               } else {
                    keyword = User.getMajor();
                    $scope.keyword = keyword;
                    $scope.jobs = jobs;
                    if(!$scope.jobs) {
                        $location.path('/');    
                    }
               }
            });
    }]);
