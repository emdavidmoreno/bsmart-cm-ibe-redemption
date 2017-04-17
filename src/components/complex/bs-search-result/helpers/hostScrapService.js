(function() {
  'use strict'
  /**
   * @return {Object}
   */
  function hostScrapService() {
    let hostScrapService = {}
    let SELECTOR_CHOOSE_CURRENCY = '#idChangeCurrency'
    let SELECTOR_CHOOSE_CURRENCY_OPTIONS =
      SELECTOR_CHOOSE_CURRENCY + ' option'
    let SELECTOR_INFO_BLOCK = '.mediaInfoBlock'
    let SELECTOR_INFO_HEAD_BLOCK = '.headBlock span'
    let SELECTOR_INFO_BODY_BLOCK = '.bodyBlock .bodyText'

    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getMediaInfoMessages = function() {
      let $infoBlocks = $(SELECTOR_INFO_BLOCK)
      let messages = []

      $infoBlocks.each(function(index, el) {
        let $el = $(el)
        let message = {
          head: $el.find(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.find(SELECTOR_INFO_BODY_BLOCK).text().trim(),
        }
        messages.push(message)
      })

      return messages
    }

    hostScrapService.getDefaultErrorMessages = function() {
      let deferred = $.Deferred() // eslint-disable-line
      let SELECTOR_ERROR_BLOCK = '#errorBlock'
      let SELECTOR_ERROR_HEAD_BLOCK = '.errorHeader span'
      let SELECTOR_ERROR_BODY_BLOCK = '.errorBody .errorText p'
      let messages = []
      setTimeout(function() {
        let $errorBlocks = $(SELECTOR_ERROR_BLOCK)
        $errorBlocks.each(function(index, el) {
          let $el = $(el)
          let head = $el.find(SELECTOR_ERROR_HEAD_BLOCK).text()
          let body = $el.find(SELECTOR_ERROR_BODY_BLOCK).text().trim()
          if(head !== '' && body !== '') {
            let message = {
              head: $el.find(SELECTOR_ERROR_HEAD_BLOCK).text(),
              body: $el.find(SELECTOR_ERROR_BODY_BLOCK).text().trim(),
            }
            messages.push(message)
          }
        })
        deferred.resolve(messages)
      }, 1500)
      return deferred
    }

    /**
     * @return {String} Copa Choose Currency Value
     */
    hostScrapService.getChooseCurrency = function() {
      return $(SELECTOR_CHOOSE_CURRENCY).val()
    }

    /**
     * @param {String} selected Selected Currency by BS
     */
    hostScrapService.getSetChooseCurrency = function(selected) {
      $(SELECTOR_CHOOSE_CURRENCY).val(selected.value)
      $(SELECTOR_CHOOSE_CURRENCY).change()
    }

    /**
     * @return {Object[]} options list
     */
    hostScrapService.getChooseCurrencyOptions = function() {
      let options = []
      let $elems = $(SELECTOR_CHOOSE_CURRENCY_OPTIONS)
      $elems.each(function(index, el) {
        let $el = $(el)
        let attrS = $el.attr('selected')
        let isSelected = (typeof attrS !== typeof undefined && attrS !== false)
        options.push({
          name: $el.text(),
          value: $el.attr('value'),
          shortName: extractCurrencyFromName($el.text()),
          isSelected: isSelected,
        })
      })
      return options
    }
    /**
     *
     * @param {String} name
     * @return {String}
     */
    function extractCurrencyFromName(name) {
      let regExp = /\(([^)]+)\)/
      let matches = regExp.exec(name)
      return matches[1]
    }

    return hostScrapService
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService)
})()
