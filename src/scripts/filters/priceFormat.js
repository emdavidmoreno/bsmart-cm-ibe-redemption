/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([], function() {
  /**
   * Angular filter to convert number to time string with currency format
   * e.g 120 => 2h 00m
   */
  function priceFormat($filter) {
    return function (price) {
        if(isNaN(price)){
            return price;
        }
        var parts = Number.parseFloat(price).toFixed(2).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };
  }

  priceFormat.$inject = ['$filter'];

  return priceFormat;
});
