define([
    'jquery',
],function($jq){
    'use strict'
    const SELECTOR_FARE_HOLD_DESCRIPTION_TEXT = ".fare-hold__description-text"
    const SELECTOR_FARE_HOLD_DESCRIPTION_NOTE = ".fare-hold__description-note"
    const SELECTOR_FARE_HOLD_ITEM_DURATION = ".fare-hold__offers-item-duration"
    const SELECTOR_FARE_HOLD_ITEM_PRICE = ".fare-hold__offers-item-price"
    const SELECTOR_FARE_HOLD_ITEM_CURRENCY = ".fare-hold__offers-item-price-currency-prefix"
    const SELECTOR_FARE_HOLD_OPTIONS = ".fare-hold__offers-item label"
    
    var clearCheckedOptions = function(optionArray){
        optionArray.forEach((item)=>{
            item.checked = false
        })
    }

    let scrapHelper = {
        getDescriptionText: function(){
            return $jq(SELECTOR_FARE_HOLD_DESCRIPTION_TEXT).text()
        },
        getDescriptionNote: function(){
            return $jq(SELECTOR_FARE_HOLD_DESCRIPTION_NOTE).html()
        },
        getFareHoldOffers: function(){
            let result =[]
            $jq(SELECTOR_FARE_HOLD_OPTIONS).each(function(index){                    
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
            console.log(result)
            return result
        }

    }

    return scrapHelper
})