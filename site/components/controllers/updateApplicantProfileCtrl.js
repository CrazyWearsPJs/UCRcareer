angular.module('ucrCareerControllers')
    .controller('UpdateApplicantProfileCtrl', ['$scope', '$location', 'User', 
    function UpdateApplicantProfileCtrl($scope, $location, User) {
        
        var profilePage = '/applicantProfile';

        $scope.$on('$viewContentLoaded', function() {
            if(!User.isApplicant()) {
                $location.path('/');
            } else {
                $scope.updateApplicantProfileData = User.getProfileData();
            }
        });
 
        $scope.user = {
            'spec': {},
            'location': {},
            'personal': {},
            'interests': []
        };
         
        $scope.update = function() {
            if($scope.updateProfile.$valid) {
                User.updateProfileData($scope.user)
                    .then(function() {
                        $location.path(profilePage);
                    }, function() {
                    });
            }
        };

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
    }]);
