define([
  'jquery',
  './hostUIService',
  './hostProxyService',
], () => {
  /**
   * hostProxyService
   *
   * @return {Object}
   */
  function hostProxyService() {
    let hostProxyService = {}
    let scrapSelectors = {
      generalActions: {
        continueButton: '#pgButtonNext',
      },
    }

    hostProxyService.selectFlightAction = function(priceNode) {
      $(priceNode).find('input').click()
    }

    hostProxyService.getFormActionNodeSelector = function() {
      return scrapSelectors.generalActions.continueButton
    }

    return hostProxyService
  }

  hostProxyService.$inject = []

  return hostProxyService
})
