/* eslint-disable max-len */
define(['jquery'], function ($jq) {
  'use strict'
  const PRICE_BASE_INFO_SELECTOR = '.expandedSection:eq(0) .detailedPrice tbody tr td.price'
  const TOTAL_PRICE_SELECTOR = 'table tr.totalPriceRow span.money'
  const SUB_TOTAL_PRICE_SELECTOR = 'div.sub-total-price span.sub-total-price__price span.money'
  const PRICE_INSURENCE_SELECTOR = '.expandedSection:eq(1)'
  const INSURANCE_SELECTOR = 'td div[id*="idInsurance1"]'
  const FARE_HOLD_SELECTOR = 'td div[id*="idAncillaryOptionElement"]'

  const SELECTOR_COP = '.rowEven.rowDiscount'

  // ----------------------- Prices Info --------------------
  /**
   * @return {Array}
   */
  const getPriceBaseInfo = () => {
    var pricesInfo = [];
    $jq(PRICE_BASE_INFO_SELECTOR).each(function () {
      let price = $(this).text().trim();
      pricesInfo.push(price)

    });
    return pricesInfo;
  }


  const getPriceInsuranceInfo = () => {
    const PRICE_SELECTOR = '.expandedSection:eq(1) .detailedPrice tbody tr td.price'
    
    return $jq(PRICE_SELECTOR).text().trim()

  }


  const existInsuranceTable = function () {
    return $jq(INSURANCE_SELECTOR).length
  }


  const existSeatTable = function () {
    let PRICE_SELECTOR = '.expandedSection:eq(2) .detailedPrice tbody tr td.price'
    if (!existInsuranceTable()){       
        PRICE_SELECTOR = '.expandedSection:eq(1) .detailedPrice tbody tr td.price'
        console.log("no existe la aseguranza", PRICE_SELECTOR)
    }
     
    return $jq(PRICE_SELECTOR).length
  }


  const getLinkOption = function () {
    return $('[aria-labelledby="idBlockExtraServicesTitle_ancillaryComponents.seats.block.title"]  .componentHeader .links').html()
  }

  const existCOP = function () {
    return $(SELECTOR_COP).length
  }


  const getPriceSeatsInfo = function () {
    let PRICE_SELECTOR = '.expandedSection:eq(2)'
    if (!existInsuranceTable())
      PRICE_SELECTOR = '.expandedSection:eq(1)'

    let infoList = []
    $jq(`${PRICE_SELECTOR} .detailedPrice tbody tr`)
      .each((index, tr) => {
        let info = $(tr).text().split('\n')
          .filter((t) => t.trim() !== '')
          .map((t) => t.trim())

        const priceText = info[info.length - 1].split(' ')

        infoList.push({
          title: info[0],
          currencyCode: priceText[0],
          price: String(priceText[0]+' '+priceText[1]),
        })
      })
    return infoList
  }



  const formatPrice = function(currency, priceString) {
    let price
    if (priceString) {
      switch (currency) {
        case 'BRL':
          price = +priceString.replace(/\./g, '').replace(',', '.')
          break
        case 'CAD':
          price = +priceString.replace(/\,/g, '')
          break
        case 'COP':
          price = +priceString.replace(/\./g, '')
          break
        case 'CLP':
          price = +priceString.replace(/\,/g, '')
          break
        case 'ARS':
          price = +priceString.replace(/\./g, '').replace(',', '.')
          break
        default:
          price = +priceString.replace(/\,/g, '')
      }
    }
    return price
  }

  /**
   * @return {String}
   */
  const getTotalPrice = () => {
    if(existFareHoldTable())
      return $jq(SUB_TOTAL_PRICE_SELECTOR).text().trim();
    return $jq(TOTAL_PRICE_SELECTOR).text().trim();
  }

  const existFareHoldTable = function(){
    return $jq(FARE_HOLD_SELECTOR).length
  }

  const getFareHoldCategory = ()=> {
    return $jq(FARE_HOLD_SELECTOR).text().trim()
  }

  const getTotalPriceLabel = () => {
    if(existFareHoldTable())
      return $jq('span[class="sub-total-price__label"]').text().trim()
    return $jq('.totalPrice .totalPriceRow td[class="label"]').text().trim()
    //return "Total"
  }

  const existPriceBlock = () => {
    return getPriceBaseInfo().length > 0
  }


  return {
    getPriceBaseInfo,
    getPriceSeatsInfo,
    getPriceInsuranceInfo,
    existSeatTable,
    existInsuranceTable,
    getLinkOption,
    existCOP,
    getTotalPrice,
    getTotalPriceLabel,
    formatPrice,
    existPriceBlock
  }
})
