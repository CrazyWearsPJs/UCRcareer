angular.module('huntEdu.controllers')
    .controller('EmployerProfileCtrl', ['$scope', 'User', '$location',
    function EmployerProfileCtrl($scope, User, $location) {
        $scope.showEmployer = function() {
            return User.isEmployer();
        };

        $scope.updateEmployer = function() {
            $location.path('/updateEmployerProfile');
        };

        $scope.edit = function(jobId) {
            var postId = jobId;
            $location.path('/updateJobPosting' + postId);
        };

        $scope.$on('$viewContentLoaded', function() {
            if(User.isEmployer()){
                var role = User.getUserRole();
                $scope.employerProfileData = User.getProfileData(role);
    	   }
            else {
                $location.path('/');
            }
        });

    }]);
