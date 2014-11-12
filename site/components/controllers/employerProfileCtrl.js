angular.module('ucrCareerControllers')
    .controller('EmployerProfileCtrl', ['$scope', 'User', '$location',
    function EmployerProfileCtrl($scope, User, $location) {
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
