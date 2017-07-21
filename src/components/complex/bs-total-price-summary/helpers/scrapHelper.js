/* eslint-disable max-len */
define(['jquery'], function($jq) {
  'use strict'
  const PRICE_BASE_INFO_SELECTOR = '.expandedSection:eq(0) .detailedPrice tbody tr td.price'
  const TOTAL_PRICE_SELECTOR = 'table tr.totalPriceRow span.money'
  const PRICE_SEAT_SELECTOR = '.expandedSection:eq(2)'
  const PRICE_INSURANCE_SELECTOR = '.expandedSection:eq(1) .detailedPrice tbody tr td.price'

  // ----------------------- Prices Info --------------------
  /**
   * @return {Array}
   */
  const getPriceBaseInfo = () => {
   var pricesInfo = [];
     $jq(PRICE_BASE_INFO_SELECTOR).each(function() {
       let price =  $(this).text().trim();
       pricesInfo.push(price)
  
     });
    return pricesInfo;  
  } 

  /**
   * @return {Array}
   */
  const getPriceInsuranceInfo = () => {   
     return $jq(PRICE_INSURANCE_SELECTOR).text().trim();
  }    

const existSeatTable = function() {
     return $jq(PRICE_SEAT_SELECTOR).length
}

const existInsuranceTable = function() {
     return $jq(PRICE_INSURANCE_SELECTOR).length
}


const getPriceSeatsInfo = function() {
    let infoList = []
    $jq(`${PRICE_SEAT_SELECTOR} .detailedPrice tbody tr`)
      .each((index, tr) => {
        let info = $(tr).text().split('\n')
          .filter((t) => t.trim() !== '' )
          .map((t) => t.trim())

        const priceText = info[info.length - 1].split(' ')

        infoList.push({
          title: info[0],
          currencyCode: priceText[0],
          price: formatPrice(priceText[0], priceText[1]),
        })
      })
    return infoList
  }



  function formatPrice(currency, priceString) {
    let price
    if (priceString) {
      switch(currency) {
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
    return $jq(TOTAL_PRICE_SELECTOR).text().trim();
  }


 return {
    getPriceBaseInfo,
    getPriceSeatsInfo,
    getPriceInsuranceInfo,
    existSeatTable,
    existInsuranceTable,
    getTotalPrice
  }
})
