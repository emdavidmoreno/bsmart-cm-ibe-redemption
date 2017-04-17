(function() {
  'use strict'

  const SELECTOR_PAGE_TITLE = '.pageTitleArea'
  const SELECTOR_PAGE_COMMENT_BLOCK = '.introTextArea p'
  const SELECTOR_TEXT_MESSAGE = '#warningText'

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

    hostScrapService.getMsg = function() {
      return $(SELECTOR_TEXT_MESSAGE).text().trim()
    }

    return hostScrapService
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService)
})()
