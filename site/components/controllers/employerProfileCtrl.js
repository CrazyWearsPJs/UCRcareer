function EmployerProfileCtrl($scope, User, USER_ROLES, $location) {
    $scope.$on('$viewContentLoaded', function() {
        if(User.getUserRole() === USER_ROLES.employer)
        {
            $scope.employerProfileData = User.getProfileData(USER_ROLES.employer);
        }
        else
        {
            $location.path('/');
        }
    });
}
  angular.module('ucrCareerControllers')
    .controller('EmployerProfileCtrl',
        [
            '$scope'
          , 'User'
          , 'USER_ROLES'
          , '$location'
          , EmployerProfileCtrl
        ]);
