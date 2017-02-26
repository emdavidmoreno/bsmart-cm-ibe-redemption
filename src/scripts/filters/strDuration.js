/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([], function() {
  /**
   * Angular filter to convert number to time string
   * e.g 120 => 2h 00m
   */
  function strDuration() {
    return function(input) {
      var duration = parseInt(input, 10);
      var hours;
      if(!isNaN(duration) || duration > 0) {
        // get hours from duration
        hours = Math.floor(duration / 60);
        // get mins
        var mins = Math.floor(duration % 60);
        // return format '00h 00m'
        return `${hours}h ${mins}m`;
      } else {
        return '00h 00m';
      }
    };
  }

  strDuration.$inject = [];

  return strDuration;
});
