var employerProfile = angular.module('employerProfile',[]);
employerProfile.controller('employerProfileCtrl', ['USER_ROLES', '$location', 
  function($scope, User, USER_ROLES, $location) {
    $scope.getInfo = function() {
        if(User.getUserRoles === USER_ROLES.employer)
        {
            $scope.employerProfileData = User.getProfileData();
        }
        else
        {
            $location.path('/');
        }
    };
}]);
