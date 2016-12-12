(function() {
  'use strict';

  function hostProxyService() {
      var hostProxyService = {};
      var scrapSelectors = {
        generalActions: {
          continueButton: '#pgButtonPurchase',
          acceptInformationContinue: '.button1'
        }
      };

      hostProxyService.getFormActionNodeSelector = function() {
        return scrapSelectors.generalActions.continueButton;
      };

      hostProxyService.acceptInformationContinueAction = function(){
        $(scrapSelectors.generalActions.acceptInformationContinue).click();
      };

      hostProxyService.bindCardCurrency = function(){
        var deferred = $.Deferred();

        $(hostProxyService).one("updatePaymentCurrencyValues", function(event, data){
          window.updatePaymentCurrencyValues = data.originalFunction;
          deferred.resolve(data);
        });

        hostProxyService.mockUpdatePaymentCurrencyValues();

        // $(hostProxyService).one("updateInstallmentsText", function(event, data){
        //   window.updateInstallmentsText = data.originalFunction;
        //   deferred.resolve(data);
        // });
        return deferred;
      }

      hostProxyService.bindPaymentValidation = function(){
        var deferred = $.Deferred();

        $(hostProxyService).one("processSuccessfulPaymentResult", function(event, data){
          window.processSuccessfulPaymentResult = data.originalFunction;
          deferred.resolve(data);
        });
        hostProxyService.mockProcessSuccessfulPaymentResult();
        return deferred;
      }



      hostProxyService.mockUpdatePaymentCurrencyValues = function(){
        var originalFunction =
          window.updatePaymentCurrencyValues;

        //Updates currency values.
        var customFunction = function (isPageLoad, idSequence) {
          var currencyCode = getElementValue("creditCard" + idSequence + ".currency:creditCard" + idSequence + ".currencySelect");
          var countryCode = getElementValue("creditCard" + idSequence + ".issuingCountry:creditCard" + idSequence + ".issuingCountrySelect");
          var country = getCardIssuingCountry(countryCode);
          var deliveryRule = getDeliveryRule();

          if (currencyCode && deliveryRule &&
            country && country.altAmounts && country.altAmounts[currencyCode] && country.altAmounts[currencyCode][deliveryRule]
              && country.altAmountTexts && country.altAmountTexts[currencyCode] && country.altAmountTexts[currencyCode][deliveryRule]
              && country.exchangeRate[currencyCode]) {
            setElementValue("creditCard" + idSequence + ".amount", country.altAmounts[currencyCode][deliveryRule]);
            setElementValue("creditCard" + idSequence + ".exchangeRate", country.exchangeRate[currencyCode]);
            document.getElementById("equivTotalText" + idSequence).innerHTML = country.altAmountTexts[currencyCode][deliveryRule];
            document.getElementById("rowEquivTotal" + idSequence).style.display = "";

          // trigger an event at the end
          $( hostProxyService ).trigger( "updatePaymentCurrencyValues",
            [{response: {equivTotalText: country.altAmountTexts[currencyCode][deliveryRule]}, config: config, originalFunction: originalFunction}]);

          }
          else if (!isPageLoad) {
            resetPaymentCurrencyValues(currencyCode == reservationCurrency, idSequence);
          }

          if (!isPageLoad) {
            showHideCardIssuingCountryInstallments(null, currencyCode, idSequence);
          }
        }

          // overwrites the original function
        window.updatePaymentCurrencyValues =
          customFunction;
      }

      // TODO: We are not implementing this yet
      hostProxyService.mockUpdateInstallmentsText = function(){
        // Updates installments text.
        function updateInstallmentsText(idSequence) {
          var currencyCode = getElementValue("creditCard" + idSequence + ".currency:creditCard" + idSequence + ".currencySelect");
          var countryCode = getElementValue("creditCard" + idSequence + ".issuingCountry:creditCard" + idSequence + ".issuingCountrySelect");
          var country = getCardIssuingCountry(countryCode);
          var installments = getElementValue("creditCard" + idSequence + ".installments:creditCard" + idSequence + ".installmentsSelect");
          var deliveryRule = getDeliveryRule();

          if (country && currencyCode && installments && deliveryRule) {
            var text = null;
            if (country.installmentsStrings[currencyCode] && country.installmentsStrings[currencyCode][deliveryRule]) {
              text = country.installmentsStrings[currencyCode][deliveryRule][installments-1];
            }
            document.getElementById("installmentsText" + idSequence).innerHTML = text ? text : "";
          } else {
            if (document.getElementById("installmentsText" + idSequence))
            {
              document.getElementById("installmentsText" + idSequence).innerHTML = "";
            }
          }
        }
      }

      hostProxyService.mockProcessSuccessfulPaymentResult = function(){
        var originalFunction =
          window.processSuccessfulPaymentResult;

        var customFunction = function (response, config) {
          // check redirect - to not show Interstitial if payment fails (TDP-47839)
           if (!config.noInterstitial && config.interstBusiness && response.redirect) {
             if (config.params.selectedFOPs)
             {
              if (config.params.selectedFOPs.length == 1 && (
                  config.params.selectedFOPs[0] == "DOKUCREDITCARD" ||
                  config.params.selectedFOPs[0] == "CYBERSOURCECREDITCARD"))
              {
                interstitialFramework.show(config.interstBusiness);
              }
             }
           }
          // invoke post-processors for each selected FOP if available
          if (multiplePaymentConfig && multiplePaymentConfig.FOPsState && multiplePaymentConfig.FOPsState.items) {
            var items = multiplePaymentConfig.FOPsState.items;
            for(var i in items)
            {
              var fopCode = items[i].fopCode;
              var fopType = items[i].fopType;
              var idSequence = items[i].fopSequence;
              if (!items[i].isDisabled && items[i].isActive)
              {
                if (response.extraParams == null) {
                  response.extraParams = {};
                }
                response.extraParams["idSequence"] = idSequence;

                if (com.datalex.tdp.payment.FOP[fopCode] && com.datalex.tdp.payment.FOP[fopCode].postprocessor) {
                  com.datalex.tdp.payment.FOP[fopCode].postprocessor(response);
                }
              }
            }
          }

          // redirect or submit hidden form
          if (response.redirect) {
            if (!response.postParameters) {
              window.location.href = response.redirect;
            } else {      
              var tDiv = document.createElement("div");
              document.body.appendChild(tDiv);
              tDiv.style.display = "none";

                var strFields = "";
              
              if (response.postParameters.constructor === Array){
                //postparams are presented like array
                for (var i = 0, len = response.postParameters.length; i < len; i++) {
                    strFields += '<input' + ' name="' + response.postParameters[i].name + '"' + ' value="' + response.postParameters[i].value + '" type="hidden">';
                  }
              }
              else {
                //postparams are presented like one object
                for (var param in response.postParameters) {
                  if (response.postParameters.hasOwnProperty(param)) {
                      strFields += '<input' + ' name="' + param + '"' + ' value="' + response.postParameters[param] + '" type="hidden">';
                  }         
                }
              }       

              var strForm = '<form action="' + response.redirect + '" method="post">' + strFields + '</form>';
              tDiv.innerHTML = strForm;

              tDiv.getElementsByTagName("form")[0].submit();
            }
          }

          $( hostProxyService ).trigger( "processSuccessfulPaymentResult",
            [{errors: response, config: config, originalFunction: originalFunction}]);

        }

        // overwrites the original function
        window.processSuccessfulPaymentResult =
          customFunction;
      }
      return hostProxyService;
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService);
})();
