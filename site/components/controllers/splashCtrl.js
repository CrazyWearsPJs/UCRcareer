angular.module('ucrCareerControllers')
    .controller('SplashCtrl', ['$scope', 'User', function($scope, User){
        $scope.showApplicant = function() {
            return User.isApplicant();
        };
    }]);
