angular.module('ucrCareerControllers')
        .controller('splashCtrl', ['$scope', '$modal', function($scope, $modal){
                $scope.user = {
                    email: "",
                    password: ""
                };
                $scope.open = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'templates/registerModal.html',
                        controller: 'registerModalCtrl',
                        size: 'lg'
                    });

                    modalInstance.result.then(function(user) {
                        console.log(user);
                        $scope.user.email = user.email;
                        $scope.user.password = user.password;
                    }, function() {
                        console.log("dey closed dis :(");
                    });
                };
        }])
        .controller('registerModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: ""
            };
            
            $scope.ok = function() {
                console.log("closing modal", $scope.user);
                $modalInstance.close($scope.user);
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);
