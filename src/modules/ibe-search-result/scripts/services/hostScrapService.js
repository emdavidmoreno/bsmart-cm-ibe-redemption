(function(){
  'use strict';

  function hostScrapService() {
    var hostScrapService = {};
    var SELECTOR_CHOOSE_CURRENCY = '#idChangeCurrency';
    var SELECTOR_CHOOSE_CURRENCY_OPTIONS =
      SELECTOR_CHOOSE_CURRENCY + ' option';
    var SELECTOR_INFO_BLOCK = '.mediaInfoBlock';
    var SELECTOR_INFO_HEAD_BLOCK = '.headBlock span';
      var SELECTOR_INFO_BODY_BLOCK = '.bodyBlock .bodyText';

    /**
     * @return {Object[]}
     *         {String} object.head
     *         {String} object.body
     */
    hostScrapService.getMediaInfoMessages = function () {
      var $infoBlocks = $(SELECTOR_INFO_BLOCK);
      var messages = [];

      $infoBlocks.each(function(index, el) {
        var $el = $(el);
        var message = {
          head: $el.find(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.find(SELECTOR_INFO_BODY_BLOCK).text().trim()
        };
        messages.push(message);
      });

      return messages;
    };

    hostScrapService.getDefaultErrorMessages = function () {
      var deferred = $.Deferred();
      var SELECTOR_ERROR_BLOCK = '#errorBlock';
      var SELECTOR_ERROR_HEAD_BLOCK = '.errorHeader span';
      var SELECTOR_ERROR_BODY_BLOCK = '.errorBody .errorText p';
      var messages = [];
      setTimeout(function(){
        var $errorBlocks = $(SELECTOR_ERROR_BLOCK);
        $errorBlocks.each(function(index, el) {
          var $el = $(el);
          var head = $el.find(SELECTOR_ERROR_HEAD_BLOCK).text();
          var body = $el.find(SELECTOR_ERROR_BODY_BLOCK).text().trim();
          if(head !== '' && body !== ''){
            var message = {
              head: $el.find(SELECTOR_ERROR_HEAD_BLOCK).text(),
              body: $el.find(SELECTOR_ERROR_BODY_BLOCK).text().trim()
            };
            messages.push(message);
          }
        });
        deferred.resolve(messages);
      }, 1500);
      return deferred;
    };

    /**
     * @return Copa Choose Currency Value
     */
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

    return hostScrapService;
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService);
})();
