angular.module('ucrCareer')
.config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl' 
            }).when('/applicantRegister', {
                templateUrl: 'templates/register/applicantRegister.html',
                controller: 'ApplicantRegisterCtrl'
            }).when('/employerRegister', {
   	        templateUrl: 'templates/register/employerRegister.html',
            	controller: 'EmployerRegisterCtrl'
            }).when('/jobPosting', {
		        templateUrl: 'templates/jobs/jobPosting.html',
        		controller: 'JobPostingCtrl'
            }).when('/searchResults', {
                templateUrl: 'templates/searchResults.html',
                controller: 'SearchResultsCtrl'
            }).when('/employerProfile', {
                templateUrl: 'templates/employerProfile.html',
                controller: 'EmployerProfileCtrl'
            }).when('/applicantProfile', {
                templateUrl: 'templates/applicantProfile.html',
                controller: 'ApplicantProfileCtrl'
            }).when('/jobListing/:keyword/:index', {
                templateUrl: 'templates/jobs/jobListing.html',
                controller: 'JobListingCtrl'
            }).when('/searchResults/:keyword', {
                templateUrl: 'templates/search/searchResults.html',
                controller: 'SearchResultsCtrl',
                resolve: {
                    jobs: ['$route', 'JobListService', function($route, JobListService) {
                        var keyword = $route.current.params.keyword;
                        return JobListService.search(keyword);
                    }]
                }
            }).when('/searchError/:keyword', {
                templateUrl: 'templates/search/searchError.html', 
                controller: ['$scope', '$routeParams', function SearchErrorCtrl($scope, $routeParams) {
                        $scope.keyword = $routeParams.key;
                
            }]}).when('/thankyou', {
                templateUrl: 'templates/thankyou.html',
                controller: 'ThankyouCtrl'
            }).when('/updateApplicantProfile', {
                templateUrl: 'templates/updateApplicantProfile.html',
                controller: 'UpdateApplicantProfileCtrl',
            }).when('/updateEmployerProfile', {
                templateUrl: 'templates/updateEmployerProfile.html',
                controller: 'UpdateEmployerProfileCtrl',
            }).when('/newJob', {
                templateUrl: 'templates/jobs/jobListing.html',
                controller: 'NewJobCtrl'
            }).when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    jobs: function(JobListService){
                        return JobListService.getRecommendedJobs();
                    }
                }    
            }).otherwise({
                    redirectTo: '/'
            });
}]);

