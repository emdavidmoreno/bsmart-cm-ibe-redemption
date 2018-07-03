define([
    'jquery',
],function($jq){
    'use strict'
    /**
     * Selectors 
     * */
    const FARE_HOLD_SELECTOR = 'td div[id*="idAncillaryOptionElementExpanded"]'
    const FARE_HOLD_TOTAL_SELECTOR = 'tr[class="totalPriceRow"]'




    /** 
     * Functions 
     * */

    const existFareHoldTable = function(){
        return $jq(FARE_HOLD_SELECTOR).length > 0
    }

    const getFareHoldCategory = ()=> {        
        return $jq(FARE_HOLD_SELECTOR).text().trim()
        
    }  

    const getFareHoldPrice = () => {
        let $uncle = $jq(FARE_HOLD_SELECTOR).parent().siblings(".price");
        return $uncle.find('div').text().trim()
        
    }

    const getFareHoldTaxesLabel = () => {
        let $grandUncle = $jq(FARE_HOLD_SELECTOR).parents('table').siblings(".detailedPrice");
        return $grandUncle.find('.item div').text().trim()        
    }

    const getFareHoldTaxesPrice = () => {
        let $grandUncle = $jq(FARE_HOLD_SELECTOR).parents('table').siblings(".detailedPrice");
        return $grandUncle.find('.price div').text().trim()  
    }

    const getFareHoldTotalLabel = () => {
        return $jq(FARE_HOLD_TOTAL_SELECTOR).find('.label div').text().trim()
    }

    const getFareHoldTotalPrice = () => {
        return $jq(FARE_HOLD_TOTAL_SELECTOR).find('.price div').text().trim()
    }

    let scrapHelper = {
        existFareHoldTable,
        getFareHoldCategory,
        getFareHoldPrice,
        getFareHoldTaxesLabel,
        getFareHoldTaxesPrice,
        getFareHoldTotalLabel,
        getFareHoldTotalPrice
    }

    return scrapHelper
})