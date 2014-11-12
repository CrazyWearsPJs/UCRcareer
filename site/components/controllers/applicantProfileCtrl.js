var applicantProfile = angular.module('applicantProfile',[]);
applicantProfile.controller('applicantProfileCtrl', ['USER_ROLES', '$location',
  function($scope, User, USER_ROLES, $location) {
    $scope.getInfo = function() {
        if(User.getUserRoles === USER_ROLES.applicant)
        {
            $scope.applicantProfileData = User.getProfileData();
        }
        else
        {
            $location.path('/');
        }
    };
}]);
