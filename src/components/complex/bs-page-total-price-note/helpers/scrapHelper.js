define(['jquery'], function($jq) {
  'use strict'
  // selectors
  let SELECTOR_NOT_IMPORTANT = '.pageTotalPrice .note p:not(.important)'
  let SELECTOR_IMPORTANT = '.pageTotalPrice .note .important'

  return {
    /**
     * @return {String}
     */
    getNotImportantNotes: function() {
      return $jq(SELECTOR_NOT_IMPORTANT).html().trim()
    },
    /**
     * @return {String}
     */
    getImportantNotes: function() {
      return $(SELECTOR_IMPORTANT).html().trim()
    },
  }
})
