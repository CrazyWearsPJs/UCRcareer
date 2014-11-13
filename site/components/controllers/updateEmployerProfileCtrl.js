angular.module('ucrCareerControllers')
    .controller('UpdateEmployerProfileCtrl', ['$scope', '$location', 'User', function UpdateEmployerProfileCtrl($scope, $location, User){
        $scope.$on('$viewContentLoaded', function() {
            if(User.isEmployer())
            {
                var role = User.getUserRole();
                $scope.updateEmployerProfileData = User.getProfileData(role);
            }
            else
            {
                $location.path('/');
            }
        });

        $scope.user = {
            'companyName': {},
            'credentials': {},
            'personal': {},
            'contact': {},
            'location': {}
        };
        
        //TEMPORARY UNTIL UPDATEPROFILE GETS FIXED
        $scope.update = function() {
            $location.path('/');
        };
//TODO
/*
        $scope.ok = function() {
            if($scope.register.$valid && !$scope.differentPassword()) {
                User.updateProfileData($scope.user, USER_ROLES.employer);
                AuthService.register(USER_ROLES.employer)
                    .then(function() {
                        //registration successful
                        $location.path('/thankyou');
                    });
            }
        };
*/
        $scope.updateCancel = function() {
            $location.path('/');
        };
   }]);
