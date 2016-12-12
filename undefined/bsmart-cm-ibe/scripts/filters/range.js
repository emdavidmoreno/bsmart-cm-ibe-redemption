/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([], function() {
  /**
   * Angular filter to create range numbers
   * e.g ng-repeat="n in [] | range:min:max:step"
   * http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
   * https://github.com/angular/angular.js/issues/10925
   */
  function range() {
    var cache = {};
    /**
     * Create array of number in the specified range
     * @param {int} min
     * @param {int} max
     * @param {int} step
     * @return {int[]}
     */
    function _privateRange(min, max, step) {
      var isCacheUseful = (max - min) > 70;
      var cacheKey;

      if (isCacheUseful) {
        cacheKey = max + ',' + min + ',' + step;

        if (cache[cacheKey]) {
          return cache[cacheKey];
        }
      }

      var _range = [];
      step = step || 1;
      for (var i = min; i <= max; i += step) {
        _range.push(i);
      }

      if (isCacheUseful) {
        cache[cacheKey] = _range;
      }

      return _range;
    }

    return function(input, min, max, step) {
      min = parseInt(min, 10);
      max = parseInt(max, 10);
      step = parseInt(step, 10);
      min = isNaN(min) ? 0 : min;
      var _min = min;
      if ( isNaN(max) ) {
        _min = 0;
        max = min;
      }
      input = _privateRange(_min, max, isNaN(step) ? 1 : step);
      return input;
    };
  }

  range.$inject = [];

  return range;
});
