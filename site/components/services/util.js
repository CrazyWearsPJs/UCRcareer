angular.module('huntEdu.services')
    .service('Util', ['_',  function UtilService(_) {
        var isFunction = _.isFunction,
            isObject = _.isObject,
            isArray = _.isArray,
            clone = _.clone,
            isEqual = _.isEqual, 
            isEmpty = _.isEmpty,
            compact = _.compact,
            omit = _.omit,
            has = _.has,
            createCallback = _.createCallback,
            flatten = _.flatten,
            rest = _.res,
            contains = _.contains,
            transform = _.transform;

        /**
         * Predicate which returns true if val is "fluffy",
         * aka it is a meaningless value - it is falsy,
         * an empty object or array or is a function
         *
         * @param {Any} val 
         * @return {Boolean} Returns true if val is fluffy
         * 
         */
        var isFluff = function(val) {
           return !val || isEmpty(val) || isFunction(val);  
        };

        var isNotFluff = function(val) {
            return !isFluff(val);
        };

        this.isFluff = isFluff;

        var pickDeep = function(collection, pred, thisArg) {
            if(isObject(pred)) {
                pred = createCallback(pred, thisArg);
            } else {
                var keys = flatten(rest(arguments));
                pred = function(key) {
                    return contains(keys, key);
                };
            }

            var isArr = isArray(collection);
            return transform(collection, function(memo, val, key) {
                var include = pred(key);
                if(!include && isObject(val)) {
                    val = pickDeep(val, pred);
                    include = !isEmpty(val);
                }
                if(include) {
                    if(isArr) { 
                        memo.push(val);
                    } else {
                        memo[key] = val;
                    }
                }
            });
        };

        this.pickDeep = pickDeep;

        /**
         * Returns a shallow clone of src minus any "fluff"
         *
         * @param {Any} src
         * @return {Any} Cloned value minus fluff properties
         */
        var compactObject = function(src) { 
            if(isArray(src)) {
                return compact(src);
            } else if(isObject(src)) {
                return omit(src, function(value) {
                    return isFluff(value); 
                });
            }
            return clone(src);
        };

        this.compactObject = compactObject;

        /**
         * Returns a deep clone of src minus any "fluff"
         *
         * @param {Any} src
         * @return {Any} Cloned src minus fluff properties
         *
         */
        this.compactObjectDeep = function(src) { 
            return pickDeep(src, isNotFluff);
        };

        /**
         * Returns a shallow clone of src minus fluff and
         * any properities it shares with other (key and value are equivalent)
         *
         * @param {Any} src
         * @param {Any} other
         * @return {Any} Cloned src with properties that are shared with other
         *
         */
        this.diffObject = function(src, other) {
            return omit(src, function(value, key) {
                return isFluff(value) || 
                        (has(other, key) && isEqual(value, other[key]));
            });
        };
    

        /**
         * Returns a grammatically correct string representing the give list
         * Based on://github.com/galah-group/galah/blob/cb9a690bf4cd31b818640381bedde6cf4711fe37/galah/base/pretty.py#L19-L53
         *
         * @param {Array} list
         * @param {String} conjunction
         * @param {String} noneString
         *
         *
         */
        this.prettyList = function(list, conjunction, noneString) {

            conjunction = conjunction || "and";
            
            if(!noneString) {
                noneString = "";
            }


            var listLen = list.length,
                conjunctionWithSpaces = " " + conjunction + " ";

            if (listLen === 0) { 
                return noneString;
            } else if (listLen === 1) {
                return list.join("");
            } else if (listLen === 2) {
                return list.join(conjunctionWithSpaces);
            } else {
                var listCloned = clone(list),
                    lastTwoItems = listCloned.splice(listLen - 2, 2);
            
                return listCloned.join(", ") + ", " + lastTwoItems.join(conjunctionWithSpaces);
            }
        };
    }]);
