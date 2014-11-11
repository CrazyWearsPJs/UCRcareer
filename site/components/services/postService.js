angular.module('ucrCareerServices')
    .service('PostService', ['$http','$q', 'User',
    function($http, $q, User){

        var Post = {
            'specifics': {
                'jobTitle': null, 
                'description': null, 
                'requirements': null, 
                'salary': null, 
                'department': null,
                'jobType': null
            },
            'location': {
                'city': null,
                'state': null
            },
            'date': {
                'postedOn': null,
                'endsOn': null
            } 
        };

        var getJobPostDataFields = function(role) {
              if(role === USER_ROLES.employer) {
                return ;
              }
              return [];
        };

        Post.setJobPostData = function(data, role) {
            var jobPostDataFields = getjobPostDataFields(role);

            forEach(data, function(value, key) {
                if(profileDataFields.indexOf(key) !== -1) {
                    User[key] = copyNonNull(data[key]);
                }
            });
        };
        
        this.post = function(role) {
            var deferred = $q.defer(),
                jobPostingRoutePrefix = '/post',
                jobPostingData = extend(Post.getPostingData())); // TODO create the get posting data function for users!!!
            $http.post(jobPostingRoutePrefix, jobPostingData)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
