'use strict'
/* jshint undef: true, unused: true */
define([], function() {
  /**
   * @return {Object}
   */
  function hostProxyService() {
    let hostProxyService = {}

    hostProxyService.submitFormAction =
      function(formActionNodeSelector, context, clb) {
        let deferred = $.Deferred() // eslint-disable-line
        // let passengerContext = false

        // mocking a function to get the results
        hostProxyService.mockProcessAirFlightSearchFormValidationErrors()
        hostProxyService.mockProcessResult()

        if (context && context === 'passengerInformation') {
          hostProxyService.mockProcessValidationResult()
          // passengerContext = true
        }
        if (context && context === 'confirmationPage') {
          hostProxyService.mockProcessValidationResultConfirmationPage()
          hostProxyService.mockProcessSentConfirmationPage()
        }

        if (context && context === 'payment') {
          hostProxyService.mockProcessPurchaseValidationErrorResult()
        }
        /**
         * triggerSuccessData
         * @param {Object} data
         */
        function triggerSuccessData(data) {
          if (clb) {
            // error, success
            clb(null, data)
          } else {
            deferred.resolve(data)
          }
        }
        /**
         * triggerSuccessData
         * @param {Object} data
         */
        function triggerErrorData(data) {
          if (clb) {
            // error, success
            clb(data, null)
          } else {
            deferred.reject(data)
          }
        }

        $('body').on('searchFormValidationErrors', function(event, data) {
          window.processAirFlightSearchFormValidationErrors =
            data.originalFunction
          triggerSuccessData(data)
        })

        $('body').on('processResult:fail', function(event, data) {
          window.formManager.processResult =
            data.originalFunction
          triggerSuccessData(data)
        })

        $('body').on('processValidationResult', function(event, data) {
          window.formManager.processValidationResult =
            data.originalFunction
          triggerSuccessData(data)
        })

        $('body').on('processPurchaseValidationErrorResult',
          function(event, data) {
            window.processPurchaseValidationErrorResult =
              data.originalFunction
            triggerSuccessData(data)
          })

        $('body').on('processValidationResponse', function(event, data) {
          window.processValidationResponse = data.originalFunction
          triggerErrorData(data)
        })

        $('body').on('processSend', function(event, data) {
          window.processSend = data.originalFunction
          triggerSuccessData(data)
        })

        $(formActionNodeSelector).click()
        return deferred
      }

    hostProxyService
      .mockProcessAirFlightSearchFormValidationErrors = function() {
        let originalFunction =
          window.processAirFlightSearchFormValidationErrors

        let customFunction = function(errors, config) {
          originalFunction.apply(window, [errors, config])
          // trigger an event at the end
          $('body').trigger('searchFormValidationErrors',
            [{
              errors: errors,
              config: config,
              originalFunction: originalFunction,
            }])
        }

        // overwrite the original function
        window.processAirFlightSearchFormValidationErrors =
          customFunction.bind(window)
      }

    hostProxyService.mockProcessValidationResult = function() {
      let originalFunction =
        window.formManager.processValidationResult

      let customFunction = function(response, config) {
        // call the original function
        originalFunction.apply(window.formManager, [response, config])

        // trigger an event at the end
        $('body').trigger('processValidationResult',
          [{
            errors: response,
            config: config,
            originalFunction: originalFunction,
          }])
      }

      window.formManager.processValidationResult =
        customFunction.bind(window.formManager)
    }

    hostProxyService.mockProcessResult = function() {
      let originalFunction =
        window.formManager.processResult
      let customFunction = function(response, config) {
        originalFunction.apply(window.formManager, [response, config])
        if (response && response.errors) {
          // trigger an event at the end
          $('body').trigger('processResult:fail',
            [{
              errors: response.errors,
              originalFunction: originalFunction,
            }])
        }
      }
      // overwrite the original function
      window.formManager.processResult =
        customFunction.bind(window.formManager)
    }

    hostProxyService.mockProcessPurchaseValidationErrorResult = function() {
      let originalFunction =
        window.processPurchaseValidationErrorResult
      let customFunction = function(response, config) {
        errorManager.showValidationErrors(
          response.validationErrors, {form: config.form})
        let idSequence = config.extraParams['idSequence']

        if (response && response.validationErrors) {
          for (let i = 0; i < response.validationErrors.length; i++) {
            let property = response.validationErrors[i].property
            if (!property) {
              continue
            }

            let match = property.match('expirationMonth')

            if (match) {
              if (property.match('ACCULYNKDEBITCARD')) {
                errorFramework.setFieldStatus({
                  elm: 'dcExpirationYear.select',
                  status: 'error',
                })
                errorFramework.setFieldStatus({
                  elm: 'dcExpirationYear.input',
                  status: 'error',
                })
              } else {
                errorFramework.setFieldStatus({
                  elm: 'creditCard' + idSequence + '.expirationYear',
                  status: 'error',
                })
              }
            }

            match = (property.indexOf('Address.state') != -1 &&
              property.indexOf('Address.state') ==
                property.lastIndexOf('Address.state')) > 0
            if (match) {
              let elements = document.getElementsByName(property + 'Display')
              if (elements && elements.length == 1) {
                errorFramework.setFieldStatus({
                  elm: elements[0].id,
                  status: 'error',
                })
              }
            }
          }
        }

        // trigger an event at the end
        $('body').trigger('processPurchaseValidationErrorResult',
          [{
            errors: response,
            config: config,
            originalFunction: originalFunction,
          }])
      }
      // overwrite the original function
      window.processPurchaseValidationErrorResult =
        customFunction.bind(window)
    }

    hostProxyService.mockProcessValidationResultConfirmationPage = function() {
      let originalFunction =
        window.processValidationResponse
      let customFunction = function(response, config) {
        originalFunction.apply(window, [response, config])

        if (response.status !== 'success') {
          // trigger an event at the end
          $('body').trigger('processValidationResponse',
            [{
              errors: response,
              config: config,
              originalFunction: originalFunction,
            }])
        }
      }
      window.processValidationResponse = customFunction.bind(window)
    }

    hostProxyService.mockProcessSentConfirmationPage = function() {
      let originalFunction = window.processSend
      let customFunction = function processSend(response, config) {
        originalFunction.apply(window, [response, config])
        // trigger an event at the end
        $('body').trigger('processSend',
          [{
            contentData: tContentData.contentData,
            config: config,
            originalFunction: originalFunction,
          }])
      }

      window.processSend = customFunction.bind(window)
    }


    hostProxyService.syncHeight = function($timeout) {
      $timeout(function() {
        $('.m-book-smart').css('min-height', $(window).height())
      }, 0)
    }

    return hostProxyService
  }

  angular
    .module('responsiveBookingEngine')
    .factory('appHostProxyService', hostProxyService)
})
