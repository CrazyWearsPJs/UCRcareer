angular.module('huntEdu.controllers')
    .controller('UpdateEmployerProfileCtrl', ['$scope', '$location', 'User', 
    function UpdateEmployerProfileCtrl($scope, $location, User){
    
        var profilePage = '/employerProfile';

        $scope.$on('$viewContentLoaded', function() {
            if(User.isEmployer()) {
                $scope.updateEmployerProfileData = User.getProfileData();
            } else {
                $location.path('/');
            }
        });

        $scope.user = {
            'companyName':"",
            'credentials': {},
            'personal': {},
            'contact': {},
            'location': {}
        };
        
        $scope.update = function() {
            if($scope.updateProfile.$valid) {
                User.updateProfileData($scope.user)
                .then(function() {
                    $location.path(profilePage);
                }, function() {
                        console.log("Profile update failed.");
                });
            }

        };
        
        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
   }]);
