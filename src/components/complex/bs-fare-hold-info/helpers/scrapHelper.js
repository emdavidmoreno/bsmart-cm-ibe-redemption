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

    let scrapHelper = {        
        fareHoldTitle,
        fareHoldPrice,
        fareHoldTotal
    }

    return scrapHelper
})