(function () {
  'use strict'

  const SELECTOR_PAGE_TITLE = '.pageTitleArea'
  const SELECTOR_PAGE_COMMENT_BLOCK =
    '.flightSelectionFaresCalendar .commentBlock'
  const SELECTOR_CHOOSE_CURRENCY = '#idChangeCurrency'
  const SELECTOR_CHOOSE_CURRENCY_OPTIONS =
    SELECTOR_CHOOSE_CURRENCY + ' option'
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


    hostScrapService.getChooseCurrency = function () {
      return $(SELECTOR_CHOOSE_CURRENCY).val()
    }

    /**
     * @param {String} selected Selected Currency by BS
     */
    hostScrapService.getSetChooseCurrency = function (selected) {
      $(SELECTOR_CHOOSE_CURRENCY).val(selected.value)
      $(SELECTOR_CHOOSE_CURRENCY).change()
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





    /**
     * @return {Object[]} options list
     */
    hostScrapService.getChooseCurrencyOptions = function () {
      let options = []
      let $elems = $(SELECTOR_CHOOSE_CURRENCY_OPTIONS)
      $elems.each(function (index, el) {
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

    //FareHold section

    const SELECTOR_FARE_HOLD_DESCRIPTION_TEXT = ".fare-hold__description"
    const SELECTOR_FARE_HOLD_DESCRIPTION_NOTE = ".fare-hold__description-note"
    const SELECTOR_FARE_HOLD_ITEM_DURATION = ".fare-hold__offers-item-duration"
    const SELECTOR_FARE_HOLD_ITEM_PRICE = ".fare-hold__offers-item-price"
    const SELECTOR_FARE_HOLD_ITEM_CURRENCY = ".fare-hold__offers-item-price-currency-prefix"
    const SELECTOR_FARE_HOLD_OPTIONS = ".fare-hold__offers-item label"
    const SELECTOR_FARE_HOLD_CONTAINER = '.fare-hold'
    const SELECTOR_FARE_HOLD_BANNER = '.fare-hold__banner h3'

    var clearCheckedOptions = function(optionArray){
        optionArray.forEach((item)=>{
            item.checked = false
        })
    }

    hostScrapService.getDescriptionImg = function(){
        return $(SELECTOR_FARE_HOLD_DESCRIPTION_TEXT).html()
    }
    hostScrapService.getDescriptionNote = function(){
        return $(SELECTOR_FARE_HOLD_DESCRIPTION_NOTE).html()
    }
    hostScrapService.getBannerImg = function(){
        return $(SELECTOR_FARE_HOLD_BANNER).html()
    }
    hostScrapService.getFareHoldOffers = function(){
        let result =[]
        $(SELECTOR_FARE_HOLD_OPTIONS).each(function(index){                    
            let label = $(this)
            
            result.push({
                checked: false,
                duration: label.find(SELECTOR_FARE_HOLD_ITEM_DURATION).text(),
                price: label.find(SELECTOR_FARE_HOLD_ITEM_PRICE).text(),
                currency: label.find(SELECTOR_FARE_HOLD_ITEM_CURRENCY).text(),
                changeStatus: function(){
                    var checkedValue = !this.checked
                    clearCheckedOptions(result)
                    this.checked = checkedValue
                    $($(".fare-hold__offers-item label")[index]).click()
                    $($(".fare-hold__offers-item label")[index])
                    .find('input').click()
                  
                }
            })
        })
        
        return result
    }

    hostScrapService.existFareHold =  ()=>{ return $(SELECTOR_FARE_HOLD_CONTAINER).length > 0 }

    return hostScrapService
  }
  angular
    .module('responsiveBookingEngine')
    .factory('hostScrapService', hostScrapService)
})()
