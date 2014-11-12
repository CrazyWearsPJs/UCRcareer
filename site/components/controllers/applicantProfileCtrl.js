function ApplicantProfileCtrl($scope, User, USER_ROLES, $location) {
    $scope.$on('$viewContentLoaded', function() {
        if(User.getUserRole() === USER_ROLES.applicant)
        {
            $scope.applicantProfileData = User.getProfileData(USER_ROLES.applicant);
	}
        else
        {
            $location.path('/');
        }
    });
}
  angular.module('ucrCareerControllers')
    .controller('ApplicantProfileCtrl',
        [
            '$scope'
	  , 'User'
          , 'USER_ROLES'
          , '$location'
          , ApplicantProfileCtrl
        ]);
