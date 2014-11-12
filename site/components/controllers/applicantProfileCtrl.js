  function ApplicantProfileCtrl($scope, User, USER_ROLES, $location) {
    $scope.getInfo = function() {
        if(User.getUserRoles() === USER_ROLES.applicant)
        {
            $scope.applicantProfileData = User.getProfileData();
        }
        else
        {
            $location.path('/');
        }
    };
}
  angular.module('ucrCareerControllers')
    .controller('ApplicantProfileCtrl',
        [
            '$scope'
          , 'USER_ROLES'
          , '$location'
          , 'User'
          , ApplicantProfileCtrl
        ]);
