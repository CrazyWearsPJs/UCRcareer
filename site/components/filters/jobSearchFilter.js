angular.module('huntEdu.filters')
       .filter('JobSearchFilter', ['_', function(_) {
          var forEach = _.forEach, 
               filter = _.filter;
            
          var stripWhitespace = function(str) {
            return str.replace(/^\s+|\s+$/g, '');
          };

          var normalize = function(str) {
            return stripWhitespace(str).toUpperCase();
          };

          return function (job) {
            var args = Array.prototype.slice.call(arguments),
                showJob = true;
            
            args = args.splice(0, 1);
            
            console.log("before filter", args);

            args = filter(args, function(arg) {
                return arg.filterUse;
            });

            console.log("after filter", args);

            forEach(args, function(arg) {
                if(arg.filterKey === "companyName") {
                    showJob = showJob && normalize(job.companyName) === normalize(arg.filterValue);
                } else if(arg.filterKey === "state") {
                    showJob = showJob && normalize(job.location.state) === normalize(arg.filterValue);
                } else if(arg.filterKey === "jobTitle") {
                    showJob = showJob && normalize(job.specifics.jobTitle) === normalize(arg.filterValue);
                }
            });

            return showJob;
          };
       }]);
