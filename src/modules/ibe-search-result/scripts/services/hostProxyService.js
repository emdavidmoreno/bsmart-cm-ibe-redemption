(function() {
  function hostProxyService() {
      var hostProxyService = {};
      var scrapSelectors = {
        generalActions: {
          continueButton: '#pgButtonNext'
        }
      };

      hostProxyService.selectFlightAction = function(priceNode){
        $(priceNode).find('input').click();
      }

      hostProxyService.getFormActionNodeSelector = function(){
        return scrapSelectors.generalActions.continueButton;
      }

      return hostProxyService;
    }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
