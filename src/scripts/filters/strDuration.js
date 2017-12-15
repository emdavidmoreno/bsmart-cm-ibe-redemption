/* jshint browser:true */
/* jshint -W003*/
'use strict'
define([], function() {
  /**
   * Angular filter to convert number to time string
   * e.g 120 => 2h 00m
   * @return {string}
   */
  function strDuration() {
    return function(input) {
      let duration = parseInt(input, 10)
      let hours
      if (!isNaN(duration) || duration > 0) {
        // get hours from duration
        hours = Math.floor(duration / 60)
        // get mins
        let mins = Math.floor(duration % 60)
        // 00m
        mins = mins > 10 ? mins : `0${mins}`
        // format '00h 00m'
        return `${hours}h ${mins}m`
      }
      return '00h 00m'
    }
  }

  strDuration.$inject = []

  return strDuration
})
