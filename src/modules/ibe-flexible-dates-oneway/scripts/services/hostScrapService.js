(function() {
  'use strict'

  const SELECTOR_PAGE_TITLE = '.pageTitleArea'
  const SELECTOR_PAGE_COMMENT_BLOCK =
    '.flightSelectionFaresCalendar .commentBlock'

  /**
   * Scrap Service for module Ibe Flexible Dates Controller
   *
   * @return {Object}
   */
  function hostScrapService() {
    let hostScrapService = {}

    /**
     * @return {String} Page Title
     */
    hostScrapService.getPageTitle = function() {
      return $(SELECTOR_PAGE_TITLE).text().trim()
    }
    /**
     * @return {String} Return page coment block html
     *                  content as string
     */
    hostScrapService.getCommentBlock = function() {
      return $(SELECTOR_PAGE_COMMENT_BLOCK).html()
    }

    return hostScrapService
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService)
})()
