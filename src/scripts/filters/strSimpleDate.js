/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([], function() {
  /**
   * Angular filter to convert number to time string
   * e.g 120 => 2h 00m
   */
  function strSimpleDate($filter) {
    return function(input) {
      var splitedInput = input.split(':');
      if(splitedInput.length > 1){
        var hours = splitedInput[0];
        var minutes = splitedInput[1];
        var seconds = 0;
        var date = new Date(Date.now());
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
      }
      var result = $filter('date')(date,'hh:mm a');
      return result;
    };
  }

  strSimpleDate.$inject = ['$filter'];

  return strSimpleDate;
});
