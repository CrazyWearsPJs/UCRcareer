angular.module('huntEdu.controllers')
    .controller('ApplicantProfileCtrl', ['$scope', 'User', '$location',
    function ApplicantProfileCtrl($scope, User, $location) {
    $scope.showApplicant = function() {
        return User.isApplicant();

    };

    $scope.isSubscribed = function() {
        return User.isSubscribed();
    };

    $scope.isCollapsed = true;

    $scope.goToNotification = function(postId) {
        $location.path('/jobListing/' + postId);
    };

    $scope.updateApplicant = function() {
        $location.path('/updateApplicantProfile');
    };

    $scope.$on('$viewContentLoaded', function() {
        if(User.isApplicant()){
            var role = User.getUserRole();
            $scope.applicantProfileData = User.getProfileData(role);
    	    $scope.showResume = User.hasResume();
            $scope.email = User.getEmail();
            var expires = User.getExpiration();
            var now = new Date();
            $scope.expires = expires.getTime() <= now.getTime() ? 'No current membership' : expires.toLocaleString();
	}
        else {
            $location.path('/');
        }
    });
}]);
