angular.module('huntEdu.controllers')
    .controller('ReviewPostingCtrl', ['$scope', '$location','User', 
    function ($scope, $location, User) {
    
    $scope.rate = 0;
    $scope.max = 5;
    $scope.isReadOnly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    
       

    /*if they are a guest, kick them out*/
    $scope.$on('$viewContentLoaded', function() {
        if(User.isGuest()) {
            $location.path('/');
        }
    });

    }]);
