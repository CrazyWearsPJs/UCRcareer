angular.module('ucrCareerControllers')
    .controller('UpdateApplicantProfileCtrl', ['$scope', '$location', 'User', function UpdateApplicantProfileCtrl($scope, $location, User){
        $scope.$on('$viewContentLoaded', function() {
            if(!User.isApplicant())
            {
                $location.path('/');
            }
            else
            {
                var role = User.getUserRole();
                $scope.updateApplicantProfileData = User.getProfileData(role);
            }
        });

 
        $scope.user = {
            'credentials': {},
            'spec': {},
            'location': {},
            'personal': {}
        };
         
        //TEMPORARY UNTIL UPDATEPROFILEDATA GETS FINISHED
        $scope.update = function() {
            $location.path('/');
        };

//TODO
/*
        $scope.ok = function() {
            if($scope.register.$valid && !$scope.differentPassword()) {
                User.updateProfileData($scope.user, USER_ROLES.applicant);
                AuthService.register(USER_ROLES.applicant)
                    .then(function(){
                        //if registration is successful
                        $location.path('/thankyou'); 
                    });
            }
        };
*/
        $scope.updateCancel = function() {
            $location.path('/');
        };
    }]);
