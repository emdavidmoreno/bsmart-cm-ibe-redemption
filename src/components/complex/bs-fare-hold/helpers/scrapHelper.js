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
    let assetsBaseUrl = "//@@HOST/app/modules/bsmart-cm-ibe/assets/images/"
    let termsUrls = {
        en: "https://www.copaair.com/en/terms-conditions-book-and-hold-fee",
        pt: "https://www.copaair.com/pt/termos-condicoes-book-and-hold-fee",
        es: "https://www.copaair.com/es/terminos-y-condiciones-de-book-and-hold-fee"
    }
    let scrapHelper = {

        getLoadingContent: function(){
            return $jq("#interstitial").html()
        },
        headerBanner: function(){
            return `<h3>
                        <img src="${assetsBaseUrl}pricelock_01.png" alt="PriceLock">
                    </h3>`
        },

        descriptionBanner: function(){
            let language = $jq("#currentLanguage").val()
            return `<a href="${termsUrls[language]}" target="_blank">
                        <img src="${assetsBaseUrl}pricelock_02_${language}.png" alt="Reserva ahora y 
                        asegura tu tarifa por los siguientes días: La compra de PriceLock no es 
                        reembolsable y no se aplica al precio del boleto. 
                        Vea todos los términos y condiciones de PriceLock.">
                        <span class="wcag-offscreen">Se abre en una nueva ventana</span>
                    </a>`
        },
        getPriceLockTitle: function(){
            return $jq(".flight-offers__head h2").text()
        },
        existFareHold: function(){
            return $(SELECTOR_FARE_HOLD_CONTAINER).length > 0
        },
        getFareHoldText: function(){
            return $('.fare-hold__text').html()
        }

    }

    return scrapHelper
})