angular.module('ucrCareerControllers')
    .controller('SplashCtrl', ['$scope', '$location', function SplashCtrl($scope, $location){
        $scope.splash = {
            'search': []
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
