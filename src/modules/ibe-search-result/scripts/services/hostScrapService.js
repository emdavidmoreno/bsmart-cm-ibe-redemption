(function(){
  'use strict';

  function hostScrapService() {
    var hostScrapService = {};
    var SELECTOR_CHOOSE_CURRENCY = '#idChangeCurrency';
    var SELECTOR_CHOOSE_CURRENCY_OPTIONS =
      SELECTOR_CHOOSE_CURRENCY + ' option';
    var SELECTOR_INFO_BLOCK = '.mediaInfoBlock .disclaimerList li';
    var SELECTOR_INFO_HEAD_BLOCK = '.mediaInfoBlock .headBlock span';
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
          head: $(SELECTOR_INFO_HEAD_BLOCK).text(),
          body: $el.text().trim()
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

    //FareHold section


    

    const SELECTOR_FARE_HOLD_DESCRIPTION = ".fare-hold__description"
    const SELECTOR_FARE_HOLD_DESCRIPTION_NOTE = ".fare-hold__description-note"
    const SELECTOR_FARE_HOLD_ITEM_DURATION = ".fare-hold__offers-item-duration"
    const SELECTOR_FARE_HOLD_ITEM_PRICE = ".fare-hold__offers-item-price"
    const SELECTOR_FARE_HOLD_ITEM_CURRENCY = ".fare-hold__offers-item-price-currency-prefix"
    const SELECTOR_FARE_HOLD_OPTIONS = ".fare-hold__offers-item label"
    const SELECTOR_FARE_HOLD_CONTAINER = '.fare-hold'
    const SELECTOR_FARE_HOLD_BANNER = '.fare-hold__banner'

    var clearCheckedOptions = function(optionArray){
        optionArray.forEach((item)=>{
            item.checked = false
        })
    }

    hostScrapService.collectFareHoldData = function(){
            
      let dfd = $.Deferred()
      var queryData = {
        "touchPoint": "FLIGHT_RESULTS"
      };
      $.get('Merchandizing.do', queryData)
      .done ((response)=>{
        let options = []
        var tempData = JSON.parse(response)
        tempData.touchPoint.groups.map((group,i)=>{
          if(group.code == "GROUP_FARE_HOLD"){
            group.components.map((item, j)=>{
              options.push({
                checked: item.checked,
                duration:item.description,
                price: item.priceValue === ""? "Free": item.priceValue,
                currency: item.priceCurrency,
                changeStatus: function(){
                  var checkedValue = !this.checked
                  clearCheckedOptions(options)
                  this.checked = checkedValue
                  $($(".fare-hold__offers-item label")[index]).click()
                  $($(".fare-hold__offers-item label")[index])
                  .find('input').click()                
                }
              })
            })
          }
        })
        dfd.resolve(options)
      })
      return dfd.promise()
    }

    hostScrapService.existFareHold =  ()=>{ return $("#touchpoint .fare-hold").children().length === 3}
    hostScrapService.existLoading = ()=>{ return $("#interstitial").css("display") == "block" }
    

    return hostScrapService;
  }
  angular
      .module('responsiveBookingEngine')
        .factory('hostScrapService', hostScrapService);
})();
