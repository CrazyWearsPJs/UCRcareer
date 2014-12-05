angular.module('huntEdu.controllers')
    .controller('JobListingCtrl',['$scope', '$location', '$http', '$q', 'User', 'USER_ROLES', 'job', 
        function ($scope, $location, $http, $q, User, USER_ROLES, job){
            
            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError');
            });

            $scope.$on('$routeChangeSuccess', function(){
                $scope.jobListingData = job;
                $scope.hasVideo = job.hasVideo();
                $scope.hasImage = job.hasImage();
            });

            $scope.showSaveBookmarkBtns = User.isLoggedIn() && (User.getUserRole() === USER_ROLES.applicant);
            $scope.isBookmarked = User.hasBookmark(job.meta.id);

            /* Get Rating array to display them*/
            
            $scope.showLoggedIn = function() {
                return User.isLoggedIn();
            };
        
            $scope.showApplicant = function() {
                return User.isApplicant();
            };

            /* Star Ratings */
            $scope.rate = 0;
            $scope.max = 5;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
            };

            /*when creating a review*/
            $scope.getRate = function() {
                $scope.rate = $scope.overStar;
            };
    
            /*when updating a review*/
            $scope.updateRate = function() {
                $scope.updatedRate = $scope.overStar;
            };

            /*Add a job review*/
            $scope.postReview = {
                'meta':{},
                'timestamps': {},
                'reviewer': {},
                'content':{}
            };
            $scope.submitReview = function() {
                $scope.postReview.content.rating = $scope.rate;    
                $scope.jobListingData.addReview($scope.postReview.content)
                    .then(function(){
                        $scope.jobListingData.pushReview($scope.postReview);
                    });
            }; 

            /* Edit a job review*/
            $scope.editing = false;
            
            $scope.editReview = function(data) {
                $scope.editing = true;
                $scope.currentReview = data;
                console.log("Editing job review", data);
            };

            $scope.submitReviewEdit = function() {
                $scope.postReview.content.rating = $scope.updatedRate;
                console.log("Edited job review", $scope.postReview);
                $scope.jobListingData.editReview($scope.postReview.content, $scope.currentReview.meta.id)
                    .then(function(){
                        $scope.editing = false;
                        $scope.postReview = null;
                    });
            };

            $scope.cancelEdit = function() {
                $scope.editing = false;
                $scope.postReview = null;
            };
            /**
             * Save a job as a bookmark
             */

            $scope.saveBookmark = function (){
                User.addBookmark(job)
                    .then(function(){
                        $scope.isBookmarked = true;
                    });
            };

            /**
             * Remove a bookmark
             */

            $scope.removeBookmark = function (){
                var jobId = job.getId();
                User.removeBookmark(jobId)
                    .then(function(){
                        $scope.isBookmarked = false;
                    });
            };
    }]);
