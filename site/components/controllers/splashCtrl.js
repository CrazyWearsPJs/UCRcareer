angular.module('ucrCareerControllers')
    .controller('SplashCtrl', ['$scope', '$location', 'User', function SplashCtrl($scope, $location, User){
        $scope.splash = {
            'search': []
        };

        $scope.showApplicant = function() {
            return User.isApplicant();
        };

        $scope.ok = function() {
            if($scope.splash.search[0]) {
                var search = $scope.splash.search.toString();
                $scope.splash.search = search.split(" ");
console.log($scope.splash.search);
                // TODO redirect to search page
            }
            else {
                $location.path('/');
            }
        };
}]);
