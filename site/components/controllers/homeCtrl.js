angular.module('huntEdu.controllers')
    .controller('HomeCtrl',['$scope', '$location', 'User', 'focusJobs', 'interestJobs',
        function homeCtrl($scope, $location, User, focusJobs, interestJobs){
            $scope.$on('$routeChangeSuccess', function(){

               if(!User.isApplicant()) {
                    $location.path('/');       
               } else {
                    $scope.focusJobs = focusJobs;
                    $scope.interestJobs = interestJobs;
                    
                    $scope.showInterestJobs = interestJobs && interestJobs.length > 0;
                    $scope.showFocusJobs = focusJobs && focusJobs.length > 0;
                    $scope.showRecommendations = $scope.showInterestJobs ||
                                                 $scope.showFocusJobs;

                    $scope.focus = User.getMajor();
                    $scope.interests = User.prettyListInterests();
               }
            });
    }]);
