(function () {
  'use strict'

  const SELECTOR_PAGE_TITLE = '.pageTitleArea'
  const SELECTOR_PAGE_COMMENT_BLOCK = '.flightSelectionFaresCalendar .commentBlock'
  const SELECTOR_INFO_MESSAGE = '.bodyText p'

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
    hostScrapService.getPageTitle = function () {
      return $(SELECTOR_PAGE_TITLE).text().trim()
    }
    /**
     * @return {String} Return page coment block html
     *                  content as string
     */
    hostScrapService.getCommentBlock = function () {
      return $(SELECTOR_PAGE_COMMENT_BLOCK).html()
    }

    hostScrapService.getDefaultInfoMessages = function () {
      let messages = []
      let $infoBlocks = $(SELECTOR_INFO_MESSAGE)
      console.log("$infoBlocks", $infoBlocks.length)
      $infoBlocks.each(function (index, el) {
        let $el = $(el)
        let body = $el.text().trim()
        if (body !== '') {
          console.log(body)
          let message = {
            content: body,
          }
          messages.push(message)

        }
      })
      return messages

    }


    return hostScrapService
  }
  angular
    .module('responsiveBookingEngine')
    .factory('hostScrapService', hostScrapService)
})()
