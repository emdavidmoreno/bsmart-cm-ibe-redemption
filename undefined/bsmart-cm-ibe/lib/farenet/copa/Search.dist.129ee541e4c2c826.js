var timer = setInterval(function() {
  if (typeof jQuery !== 'undefined') {
     clearInterval(timer);

     window.Farenet = (function() {
      'use strict';

      /*
        Private variables
      */
      var instance = {},
          $ = jQuery;

      /*
        Public API
      */
      instance.getResult = function() {
        var result = instance.parse();
        return result;
      };

      instance.parseAndSend = function() {
        var result = instance.parse();
        if (result && (typeof result === 'object')) {
          sendData(result);
          $(window).trigger('parse:completed', {
            page: 'search',
            result: result
          });
        }
      };

      instance.parse = function() {
        try {
          var result = getResult();
          return result;
        } catch (e) {
          console.log('There was an error: ' + e);
        }
      };

      // First time trigger
      instance.parseAndSend();

      return instance;

      /*
        Private functions (parse)
      */
      function sendData(result){
        /*  TODO uncomment to send data to server  add ajax POST
        result = JSON.stringify(result);


        */
      }

      function getResult() {
        var JSON_VERSION = '2.1.0',
            AIRLINE = {
              id: 'copaair',
              code: 'cm'
            },
            user_input_journey_type = getJourneyType(),
            datasource = getDatasource(),
            geo = {},
            extra_info = {};

        // 'currentLang' & 'current_PoS' are taken from Global Scope of current page
        geo.language = getSiteEditionAndLanguage(currentLang, current_PoS);
        extra_info.device_category = getDeviceCategory();

        var result = {
          version: JSON_VERSION,
          airline: AIRLINE,
          user_input_journey_type: user_input_journey_type,
          datasource: datasource,
          flight_type: -1,
          geo: geo,
          extra_info: extra_info
        };

        return result;
      }

      function getJourneyType() {
        var journeyType = $('input[name=tripType]:checked').val();

        if (journeyType) {
          switch(journeyType) {
            case 'OW':
              journeyType = 'One Way';
              break;
            case 'MC':
              journeyType = 'Multi City';
              break;
            default:
              journeyType = 'Round Trip';
          }
        }

        return journeyType;
      }

      function getDatasource() {
        var flexibleDates = $('input[name=flexibleSearch]:checked').val(),
            type;
        var referrer = document.referrer;


        if (flexibleDates === 'true') {
          type = 'flexible-dates';
        } else {
          type = 'default';
        }

        var datasource = {
            step: 'ibe-search',
            type: type,
            url : document.URL,
            referrer: referrer
        };
        return datasource;
      }

      function getSiteEditionAndLanguage(langFromSite, editionFromSite) {
        var siteEdition = editionFromSite.replace('CM', '').toLowerCase(),
            language = {};

        siteEdition = langFromSite + '-' + siteEdition;

        language.site_edition = siteEdition;
        language.lang = langFromSite;

        return language;
      }

      function getDeviceCategory() {
        var deviceCategory;

        if (navigator.userAgent.match(/iPad|PlayBook|Silk/i)) {
          deviceCategory = 'tablet';
        } else if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|Blackberry|IEMobile|Opera Mini/i)) {
          deviceCategory = 'mobile';
        } else {
          deviceCategory = 'desktop';
        }

        return deviceCategory;
      }

    })();
  }
}, 300);
