angular.module('ucrCareerControllers')
    .controller('ApplicantProfileCtrl', ['$scope', 'User', '$location',
    function ApplicantProfileCtrl($scope, User, $location) {
    $scope.$on('$viewContentLoaded', function() {
        if(User.isApplicant()){
            var role = User.getUserRole();
            $scope.applicantProfileData = User.getProfileData(role);
    	}
        else {
            $location.path('/');
        }
    });
}]);
