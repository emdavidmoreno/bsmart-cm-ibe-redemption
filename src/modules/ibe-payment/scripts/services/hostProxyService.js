/* eslint-disable new-cap,max-len*/
(function() {
  'use strict'
  /**
   *  @return {Object}
   */
  function hostProxyService() {
    let hostProxyService = {}
    let scrapSelectors = {
      generalActions: {
        continueButton: '#pgButtonPurchase',
        acceptInformationContinue: '.button1',
      },
    }

    hostProxyService.getFormActionNodeSelector = function() {
      return scrapSelectors.generalActions.continueButton
    }

    hostProxyService.acceptInformationContinueAction = function() {
      $(scrapSelectors.generalActions.acceptInformationContinue).click()
    }

    hostProxyService.bindCardCurrency = function() {
      let deferred = $.Deferred()

      $(hostProxyService).one('updatePaymentCurrencyValues',
        function(event, data) {
          window.updatePaymentCurrencyValues = data.originalFunction
          deferred.resolve(data)
        })

      hostProxyService.mockUpdatePaymentCurrencyValues()
      return deferred
    }

    hostProxyService.bindPaymentValidation = function() {
      let deferred = $.Deferred()

      $(hostProxyService).one('processSuccessfulPaymentResult',
        function(event, data) {
          window.processSuccessfulPaymentResult = data.originalFunction
          deferred.resolve(data)
        })
      hostProxyService.mockProcessSuccessfulPaymentResult()
      return deferred
    }


    hostProxyService.mockUpdatePaymentCurrencyValues = function() {
      let originalFunction =
          window.updatePaymentCurrencyValues

        // Updates currency values.
      let customFunction = function(isPageLoad, idSequence) {
        const iSeq = idSequence
        let currencyCode = getElementValue(
          `creditCard${iSeq}.currency:creditCard${iSeq}.currencySelect`
        )
        let countryCode = getElementValue(
          `creditCard${iSeq}.issuingCountry:creditCard${iSeq}.issuingCountrySelect` // eslint-disable-line
        )
        let country = getCardIssuingCountry(countryCode)
        let deliveryRule = getDeliveryRule()

        if (currencyCode && deliveryRule &&
            country && country.altAmounts &&
            country.altAmounts[currencyCode] &&
            country.altAmounts[currencyCode][deliveryRule]
            && country.altAmountTexts &&
            country.altAmountTexts[currencyCode] &&
            country.altAmountTexts[currencyCode][deliveryRule]
              && country.exchangeRate[currencyCode]) {
          setElementValue(
            'creditCard' + idSequence + '.amount', country.altAmounts[currencyCode][deliveryRule]
          )
          setElementValue(
            'creditCard' + idSequence + '.exchangeRate', country.exchangeRate[currencyCode]
          )
          document.getElementById(
            'equivTotalText' + idSequence
          ).innerHTML = country.altAmountTexts[currencyCode][deliveryRule]
          document.getElementById('rowEquivTotal' + idSequence).style.display = ''

          // trigger an event at the end
          $( hostProxyService ).trigger( 'updatePaymentCurrencyValues',
            [{
              response: {
                equivTotalText: country.altAmountTexts[currencyCode][deliveryRule],
              },
              config: config, // eslint-disable-line
              originalFunction: originalFunction,
            }])
        } else if (!isPageLoad) {
          // eslint-disable-next-line
          resetPaymentCurrencyValues(currencyCode == reservationCurrency, idSequence)
        }

        if (!isPageLoad) {
          showHideCardIssuingCountryInstallments(null, currencyCode, idSequence)
        }
      }

          // overwrites the original function
      window.updatePaymentCurrencyValues =
          customFunction
    }

    hostProxyService.mockProcessSuccessfulPaymentResult = function() {
      let originalFunction =
          window.processSuccessfulPaymentResult

      let customFunction = function(response, config) {
          // check redirect - to not show Interstitial if payment fails (TDP-47839)
        if (!config.noInterstitial && config.interstBusiness && response.redirect) {
          if (config.params.selectedFOPs) {
            if (config.params.selectedFOPs.length == 1 && (
                  config.params.selectedFOPs[0] == 'DOKUCREDITCARD' ||
                  config.params.selectedFOPs[0] == 'CYBERSOURCECREDITCARD')) {
              interstitialFramework.show(config.interstBusiness)
            }
          }
        }
          // invoke post-processors for each selected FOP if available
        if (multiplePaymentConfig &&
          multiplePaymentConfig.FOPsState && multiplePaymentConfig.FOPsState.items) {
          let items = multiplePaymentConfig.FOPsState.items
          for(let i in items) { // eslint-disable-line
            let fopCode = items[i].fopCode
            // let fopType = items[i].fopType
            let idSequence = items[i].fopSequence
            if (!items[i].isDisabled && items[i].isActive) {
              if (response.extraParams == null) {
                response.extraParams = {}
              }
              response.extraParams['idSequence'] = idSequence

              if (com.datalex.tdp.payment.FOP[fopCode] &&
                com.datalex.tdp.payment.FOP[fopCode].postprocessor) {
                com.datalex.tdp.payment.FOP[fopCode].postprocessor(response)
              }
            }
          }
        }

          // redirect or submit hidden form
        if (response.redirect) {
          if (!response.postParameters) {
            window.location.href = response.redirect
          } else {
            let tDiv = document.createElement('div')
            document.body.appendChild(tDiv)
            tDiv.style.display = 'none'

            let strFields = ''

            if (response.postParameters.constructor === Array) {
                // postparams are presented like array
              for (let i = 0, len = response.postParameters.length; i < len; i++) {
                strFields += '<input' + ' name="' + response.postParameters[i].name + '"' + ' value="' + response.postParameters[i].value + '" type="hidden">'
              }
            } else {
                // postparams are presented like one object
              for (let param in response.postParameters) {
                if (response.postParameters.hasOwnProperty(param)) {
                  strFields += '<input' + ' name="' + param + '"' + ' value="' + response.postParameters[param] + '" type="hidden">'
                }
              }
            }

            let strForm = '<form action="' + response.redirect + '" method="post">' + strFields + '</form>'
            tDiv.innerHTML = strForm

            tDiv.getElementsByTagName('form')[0].submit()
          }
        }

        $( hostProxyService ).trigger( 'processSuccessfulPaymentResult',
            [{errors: response, config: config, originalFunction: originalFunction}])
      }

        // overwrites the original function
      window.processSuccessfulPaymentResult =
          customFunction
    }

    /**
     * Wrapper for some host function in submit action
     *
     * @return {$.Deferred}
     */
    hostProxyService.bindPaymentSubmit = () => {
      let deferred = $.Deferred()
      const origFn = window.processPurchaseValidationErrorResult
      /**
       * Mock Function processPurchaseValidationErrorResult
       */
      let mockFn = function(...args) {
        origFn.call(window, ...args)
        deferred.resolve(args[0])
      }

      window.processPurchaseValidationErrorResult = mockFn.bind(window)
      return deferred
    }

    return hostProxyService
  }

  angular
      .module('responsiveBookingEngine')
      .factory('hostProxyService', hostProxyService)
})()
