angular.module('huntEdu')
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
            }).when('/updateJobPosting/:id', {
                templateUrl: 'templates/jobs/updateJobPosting.html',
                controller: 'UpdateJobPostingCtrl'
            }).when('/searchResults', {
                templateUrl: 'templates/searchResults.html',
                controller: 'SearchResultsCtrl'
            }).when('/employerProfile', {
                templateUrl: 'templates/employerProfile.html',
                controller: 'EmployerProfileCtrl'
            }).when('/applicantProfile', {
                templateUrl: 'templates/applicantProfile.html',
                controller: 'ApplicantProfileCtrl'
            }).when('/jobListing/:id', {
                templateUrl: 'templates/jobs/jobListing.html',
                controller: 'JobListingCtrl',
                resolve: {
                    job: ['$route', 'SearchService', function($route, SearchService) {
                        var id = $route.current.params.id;
                        return SearchService.findJobById(id);
                    }]
                }
            }).when('/searchResults/:keyword', {
                templateUrl: 'templates/search/searchResults.html',
                controller: 'SearchResultsCtrl',
                resolve: {
                    jobs: ['$route', 'SearchService', function($route, SearchService) {
                        var keyword = $route.current.params.keyword;
                        return SearchService.search(keyword);
                    }]
                }
            }).when('/searchError', {
                templateUrl: 'templates/search/searchError.html', 
            }).when('/thankyou', {
                templateUrl: 'templates/thankyou.html',
                controller: 'ThankyouCtrl'
            }).when('/updateApplicantProfile', {
                templateUrl: 'templates/updateApplicantProfile.html',
                controller: 'UpdateApplicantProfileCtrl',
            }).when('/updateEmployerProfile', {
                templateUrl: 'templates/updateEmployerProfile.html',
                controller: 'UpdateEmployerProfileCtrl',
            }).when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    focusJobs: ['SearchService', function(SearchService){
                        return SearchService.getRecommendedFocusJobs();
                    }],

                    interestJobs: ['SearchService', function(SearchService) {
                        return SearchService.getRecommendedInterestJobs();
                    }]
                }
            }).otherwise({
                    redirectTo: '/'
            });
}]);

