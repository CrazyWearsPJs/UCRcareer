angular.module('ucrCareerControllers')
    .controller('UpdateApplicantProfileCtrl', ['$scope', '$location', 'fileUpload', 'User', 
    function UpdateApplicantProfileCtrl($scope, $location, fileUpload, User) {
        
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
                        fileUpload.uploadFileToUrl($scope.user.spec.resume, '/upload', function(){ 
                            $location.path(profilePage);
                        });
                    }, function() {
                    });
            }
        };

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
    }]);
