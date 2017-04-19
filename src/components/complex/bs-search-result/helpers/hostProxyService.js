define([
  'jquery',
  './hostUIService',
  './hostProxyService',
], () => {
  'use strict'

  function getHostProxyService() {
    let hostProxyService = {}
    let scrapSelectors = {
      generalActions: {
        continueButton: '#pgButtonNext',
      },
    }

    hostProxyService.selectFlightAction = function (priceNode) {
      $(priceNode).find('input').click()
    }

    hostProxyService.getFormActionNodeSelector = function () {
      return scrapSelectors.generalActions.continueButton
    }

    return hostProxyService
  }


  return {
    getHostProxyService: getHostProxyService,
  }
})







