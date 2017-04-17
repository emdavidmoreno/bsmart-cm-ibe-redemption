(function() {
  'use strict'

  const SELECTOR_PAGE_TITLE = '.pageTitleArea'
  const SELECTOR_PAGE_COMMENT_BLOCK = '.flightSelectionFaresCalendar .commentBlock'
  const SELECTOR_CHOOSE_CURRENCY = '#idChangeCurrency'
  const SELECTOR_CHOOSE_CURRENCY_OPTIONS =
      SELECTOR_CHOOSE_CURRENCY + ' option';

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


     hostScrapService.getChooseCurrency = function() {
      return $(SELECTOR_CHOOSE_CURRENCY).val();
    };

    /**
     * @param {String} value Selected Currency by BS
     */
    hostScrapService.getSetChooseCurrency = function(selected) {
      $(SELECTOR_CHOOSE_CURRENCY).val(selected.value);
      $(SELECTOR_CHOOSE_CURRENCY).change();
    };

    /**
     * @return {Object[]} options list
     */
    hostScrapService.getChooseCurrencyOptions = function() {
      var options = [];
      var $elems = $(SELECTOR_CHOOSE_CURRENCY_OPTIONS);
      $elems.each(function(index, el) {
        var $el = $(el);
        var attrS = $el.attr('selected');
        var isSelected = (typeof attrS !== typeof undefined && attrS !== false);
        options.push({
          name: $el.text(),
          value: $el.attr('value'),
          shortName: extractCurrencyFromName($el.text()),
          isSelected: isSelected
        });
      });
      return options;
    };

    function extractCurrencyFromName(name){
      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(name);
      return matches[1];
    }







    return hostScrapService
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService)
})()
