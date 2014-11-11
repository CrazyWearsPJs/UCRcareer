  function EmployerProfileCtrl($scope, User, USER_ROLES, $location) {
    $scope.getInfo = function() {
        if(User.getUserRoles() === USER_ROLES.employer)
        {
            $scope.employerProfileData = User.getProfileData();
        }
        else
        {
            $location.path('/');
        }
    };
}
  angular.module('ucrCareerControllers')
    .controller('EmployerProfileCtrl',
        [
            '$scope'
          , 'USER_ROLES'
          , '$location'
          , 'User'
          , EmployerProfileCtrl
        ]);
