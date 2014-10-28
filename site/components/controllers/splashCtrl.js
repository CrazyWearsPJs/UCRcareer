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
                    });
                };
        }])
        .controller('registerModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
            $scope.user = {
                email : "",
                password: "",
                reEnterPassword: ""
            };
           

            var updated_email = "", updated_password = "" , updated_reEnterPassword = "";
            /*           
            $scope.$watchGroup(["user.email", "user.password", "user.reEnterPassword"],
                function(updated) {
                    console.log(updated);
                console.log($scope.user.email);
            updated_email = updated[0];
                updated_password = updated[1];
                updated_reEnterPassword = updated[2];
                $scope.user.reEnterPassword.$error = {
                    different: updated_reEnterPassword !== updated_email
                };

                $scope.submitAvailable = updated_email.$valid && updated_password.$valid && 
                   updated_reEnterPassword.$valid;
            });
            */

            var differentPassword = function() {
                return $scope.user.password !== $scope.user.reEnterPassword;
            };

            $scope.invalidPasswordTouched = function() {
                return $scope.register.password.$invalid && $scope.register.password.$touched;
            };

            $scope.differentPasswordTouched = function() {
                return $scope.register.reEnterPassword.$touched && 
                    $scope.register.password.$viewValue !== $scope.register.reEnterPassword.$viewValue;
            };

            $scope.ok = function() {
                console.log($scope.differentPasswordTouched());
                if ($scope.register.$valid && !differentPassword()) {
                    $modalInstance.close($scope.user);
                }
            };
            
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);
