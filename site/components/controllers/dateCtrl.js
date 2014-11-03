angular.module('ucrCareerControllers')
	.controller('DateCtrl', ['$scope', 
	function($scope){
		$scope.datepickers = {
		    dt: false,
		    dtSecond: false
		};

		$scope.today = function(){
		    $scope.dt = new Date();
		    $scope.dt = new Date();
		    
		    $scope.dtSecond = new Date();
		};
		$scope.today();

		$scope.clear = function(){
		    $scope.dt = null;
		};
		//Disable weekend selection
		$scope.disabled = function(date, mode){
		    return(mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
		};

		$scope.toggleMin = function(){
		   $scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.open = function($event, which){
		    $event.preventDefault();
		    $event.stopPropagation();

		    $scope.opened = true;
		
//		    $scope.closeAll();
//		    datePicker.opened = true;
		    $scope.datepickers[which] = true;
		};
/*
		$scope.closAll = function(){
		    $scope.dateFrom.opened = false;
		    $scope.dateTo.opened = false;
		};
*/	
		$scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
}]);
