define([], function() {
  'use strict';
  //jshint -W003
  function hostProxyService() {
    var hostProxyService = {};
    var selectors = {
      submitButton: '.botButtonSearch a'
    };

    //-----------------------------------------------------------
    // Public API
    //-----------------------------------------------------------

    /**
     * Retrieve the airports from copa
     * @param  {String}   query    String Query
     * Exp: 'Mia'
     * @param  {Function} callback Success function
     */
    hostProxyService.getFromAirports = function(query, callback) {
      var config = {
        form: "LocationSearchForm",
        params: {
          locationName: query,
          locationType: 1,
          domain: 'AIR'
        },
        success: function(response){
          //TODO: Find a way to remove the eval from here
          // but the 3rd party API is sending the data as javascript not like
          // json, So, you know
          try{
            response = eval(response);
            callback(response);
          }
          catch(e){
          }
          //JSON.parse(response.replace(/;\s*\/\*.+\*\//,''));
        },
        url: 'LocationSearch.do'
      }
      ajax.request(config);
    }

    /**
     * Retrieve the airports to copa
     * @param  {String}   query    String Query
     * Exp: 'Mia'
     * @param  {Function} callback Success function
     */
    hostProxyService.getToAirports = function(query, callback) {
      // ajax.request
      var config = {
        form: "LocationSearchForm",
        params: {
          locationName: query,
          locationType: 2,
          domain: 'AIR'
        },
        success: function(e){
          console.log(e);
          callback(e);
        },
        url: 'LocationSearch.do'
      }
      ajax.request(config);
    }

    hostProxyService.getFormActionNodeSelector = function(){
      return selectors.submitButton;
    }

    hostProxyService.setupPopupListenerForScroll = function(){
      $(window).on('scroll', function(e) {
        let targetId = '';
        if (e && e.currentTarget && e.currentTarget['$hfElms']) {
          targetId = $(e.currentTarget['$hfElms']).attr('id');
        }
        console.log("target.id, ", targetId);
        // when login popup Iframe if active, disable scroll.
        if (targetId == 'externalLoginPopupDialog' && $('#externalLoginPopupOuter').css('display') != 'none') {
          window.scroll(0,0);
        }
      })
    }

    return hostProxyService;
  }
  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
});
