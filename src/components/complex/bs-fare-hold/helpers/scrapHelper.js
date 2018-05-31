define([
    'jquery',
],function($jq){
    'use strict'
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

    let scrapHelper = {

        getLoadingContent: function(){
            return $jq("#interstitial").html()
        },
        headerBanner: function(){
            return $jq(SELECTOR_FARE_HOLD_BANNER).html()
        },

        descriptionBanner: function(){
            return $jq(SELECTOR_FARE_HOLD_DESCRIPTION_TEXT).html()
        },
        getPriceLockTitle: function(){
            return $jq(".flight-offers__head h2").text()
        }

    }

    return scrapHelper
})