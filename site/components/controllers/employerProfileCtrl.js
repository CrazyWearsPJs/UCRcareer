var employerProfile = angular.module('employerProfile',[]);
employer.profile.controller('employerProfileCtrl', function($scope, $http) {
  $http.get(/*TODO what goes here?*/).success(function(data) {
    $scope.employerProf = data;
  });
});
