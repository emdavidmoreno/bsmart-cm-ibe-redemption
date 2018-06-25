define([
    'jquery',
],function($jq){
    'use strict'

    const  fareHoldTitle = ()=>{
        return $jq('#idDetailsSubBlockExtraServicesBody_1 .colTitle.colFirst').text().trim()
    }

    const fareHoldPrice = () => {
        return $jq('#idDetailsSubBlockExtraServicesBody_1 .colPrice.colLast').text().trim()
    }

    const fareHoldTotal = () => {
        return $(".componentTotal .colTotal").text()
    }

    const showFareHoldInfo = () => {
        return $("#idDetailsSubBlockExtraServicesBody_1").length > 0
    }

    let scrapHelper = {        
        fareHoldTitle,
        fareHoldPrice,
        fareHoldTotal,
        showFareHoldInfo
    }

    return scrapHelper
})