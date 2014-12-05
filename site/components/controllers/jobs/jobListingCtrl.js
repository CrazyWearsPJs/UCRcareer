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
  
            $scope.isOriginalPoster = function(review) {
                return User.isApplicant() && User.getEmail() === review.reviewer.credentials.email;
            };

            $scope.showLoggedIn = function() {
                return User.isLoggedIn();
            };
        
            $scope.showModified = function(review) {
                var created = new Date(review.timestamps.created),
                    modified =  new Date(review.timestamps.lastModified);
                
                return modified > created;
            };

            $scope.showReviewPosting = function () {
                return User.isApplicant() && !$scope.editing;
            };

            $scope.showApplicant = function() {
                return User.isApplicant();
            };

            /* Star Ratings */
            $scope.rate = 0;
            $scope.updatedRate = 0;
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

            var nukeIt = function(obj) {
                obj.reviewer = {};
                obj.meta = {};
                obj.content = {};
                obj.timestamps = {};
            };

            $scope.submitReview = function() {
                $scope.postReview.content.rating = $scope.rate;    
                $scope.jobListingData.addReview($scope.postReview.content)
                    .then(function(res){
                        var newReview = res.data;
                        newReview.reviewer = {
                               "credentials": {
                                    "email": User.getEmail()
                               }
                        };
                        nukeIt($scope.postReview);
                        $scope.jobListingData.pushReview(newReview);
                    });
            }; 

            /* Edit a job review*/
            $scope.editing = false;
    
            $scope.postEditReview = {
                'meta':{},
                'timestamps':{},
                'reviewer':{},
                'content':{}
            };
            
            $scope.editReview = function(data) {
    
                $scope.editing = true;
                $scope.currentReview = data;
            };

            $scope.submitReviewEdit = function() {
                $scope.postEditReview.content.rating = $scope.updatedRate;
                $scope.jobListingData.editReview($scope.postEditReview.content, $scope.currentReview.meta.id)
                    .then(function(res){
                        var updatedReview = res.data;
                        updatedReview.reviewer = {
                               "credentials": {
                                    "email": User.getEmail()
                               }
                        };
                        $scope.editing = false;
                        $scope.jobListingData.updateReview(updatedReview);
                        nukeIt($scope.postEditReview);
                    });
            };

            $scope.cancelEdit = function() {
                $scope.editing = false;
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
