angular.module('ucrCareerControllers')
        .controller('RegisterCtrl', ['$scope', 'User', 
        function($scope, User){
            $scope.user = {
                email: "", 
                password: ""
            };
            var credentials = User.getCredentials();
            if (credentials.email !== null) {
                $scope.user.email = credentials.email;
            }
            
            if(credentials.password !== null) {
                $scope.user.password = credentials.password;
            }
       }]);


