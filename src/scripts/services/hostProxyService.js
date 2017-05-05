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
        hostProxyService.mockInvokeBusinessAction()
        hostProxyService.mockProcessResult()

        if(context && context === 'passengerInformation') {
          hostProxyService.mockProcessValidationResult()
        // passengerContext = true
        }
        if(context && context === 'confirmationPage') {
          hostProxyService.mockProcessValidationResultConfirmationPage()
          hostProxyService.mockProcessSentConfirmationPage()
        }

        if(context && context === 'payment') {
          hostProxyService.mockProcessPurchaseValidationErrorResult()
        }
        /**
         * triggerSuccessData
         * @param {Object} data
         */
        function triggerSuccessData(data) {
          if(clb) {
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
          if(clb) {
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
          window.processValidationResponse =
          data.originalFunction
          triggerErrorData(data)
        })

        $('body').on('processSend', function(event, data) {
          window.processSend =
          data.originalFunction
          triggerSuccessData(data)
        })

        // passengerContext ? checkDoubleSubmition(confirmTravellerProceed):
        //    $(formActionNodeSelector).click();
        $(formActionNodeSelector).click()
        return deferred
      }

    hostProxyService
      .mockProcessAirFlightSearchFormValidationErrors = function() {
        let originalFunction =
          window.processAirFlightSearchFormValidationErrors
        let customFunction = function(errors, config) {
          // Show guest block errors
          let validationErrors = guestTypeControl
            .showValidationErrors(errors.validationErrors, {form: config.form})

          // Show other errors
          errorManager.showValidationErrors(validationErrors, {
            form: config.form,
          })

          // Highlight time fields
          let form = errorManager.getForm(config.form)
          for (let i = 0; i < validationErrors.length; i++) {
            let property = validationErrors[i].property
            if (property === null) {
              continue
            }
            let index = property.lastIndexOf('departureDate')
            if (index >= 0) {
              let timeField = property.substring(0, index) + 'departureTime'
              let element = form.elements[timeField]
              errorFramework.setFieldStatus({
                elm: element,
                status: 'error',
                msgOptions: 'miss',
              })
            }
          }

          // trigger an event at the end
          $('body').trigger( 'searchFormValidationErrors',
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

    hostProxyService.mockInvokeBusinessAction = function() {
      // let originalFunction = window.formManager.invokeBusinessAction
      let newConfig
      let customFunction = function(response, config) {
        if (config.ajax) {
          let params = (config.extraParams) ? config.extraParams : {}
          params.ajaxAction = true
          newConfig = {
            form: config.form,
            url: formManager.getForm(config.form).action,
            dataType: 'json',
            params: params,
            overrideParams: config.overrideParams,
            interstBusiness: config.interstBusiness,
            noInterstitial: config.noInterstitial,
            success: formManager.processResult,
            error: formManager.error,
            customSuccessHandler: config.customSuccessHandler,
            customErrorHandler: config.customErrorHandler,
            skipCommonErrorBlock: config.skipCommonErrorBlock,
          }

          if (!config.noInterstitial) {
            let interstConfig = {}
            if (config.interstBusiness) {
              interstConfig=config.interstBusiness
              interstConfig.content=
                (interstConfig.content) ? interstConfig.content :
                  interstitialContents.business
              interstConfig.opacityClassName=
                (interstConfig.opacityClassName) ?
                  interstConfig.opacityClassName : 'interstStyle2'
              interstConfig.scrolling=
                (interstConfig.scrolling) ? interstConfig.scrolling : 'no'
            }
                  // COMMENTED @OURS:
                  // Never shows the splash
                  // interstitialFramework.show(interstConfig);
                  // END COMMENTED @OURS:
          }
          ajax.request(newConfig)
        } else {
          formManager.getForm(config.form).submit()
        }
      }
      // overwrite the original function
      window.formManager.invokeBusinessAction =
        customFunction.bind(window.formManager)
    }

    hostProxyService.mockProcessValidationResult = function() {
      let originalFunction =
        window.formManager.processValidationResult
      let customFunction = function(response, config) {
        // let isValidResponse = true
        if (!response) {
          return
        }

        let form = formManager.getForm(config.form)
        errorManager.resetValidationErrors(form)

        if (response.status === 'success') {
          formManager.invokeBusinessAction(response, config)
        } else if (response.validationErrors) {
          if (config.customValidationErrorHandler) {
            config.customValidationErrorHandler(response, config)
          } else {
            errorManager
              .showValidationErrors(response.validationErrors, {form: form})
          }
        } else if (response.errors) {
          errorManager.reset(config)
          errorManager.showServiceErrors(response.errors)
        }

          // trigger an event at the end
        $('body').trigger( 'processValidationResult',
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
        if (!response) {
          return
        }
        if (response.redirect && !config.customSuccessHandler) {
          if (!response.postParameters) {
            window.location.href = response.redirect
          } else {
            let tDiv = document.createElement('div')
            document.body.appendChild(tDiv)
            tDiv.style.display = 'none'

            let strFields = ''
            const rpSize = response.postParameters.length
            for (let i = 0, len = rpSize; i < len; i++) {
              strFields += '<input' + ' name="' +
                response.postParameters[i].name + '"' +
                ' value="' + response.postParameters[i].value +
                '" type="hidden">'
            }

            let strForm = '<form action="' +
              response.redirect + '" method="post">' +
              strFields + '</form>'
            tDiv.innerHTML = strForm

            tDiv.getElementsByTagName('form')[0].submit()
          }
        } else {
          errorManager.reset(config)

          if (!config.noInterstitial && !response.redirect) {
            let interstConfig = (config.interstBusiness) ?
              config.interstBusiness : {}
            interstitialFramework.hide(interstConfig)
          }
          if (response.status === 'success' && config.customSuccessHandler) {
            config.customSuccessHandler(response, config)
          } else if (response.status === 'fail') {
            if (!config.customErrorHandler) {
              errorManager.showErrors(response, {form: config.form})
            } else {
              config.customErrorHandler(response, config)
            }
            if (response.webstatisticsCall) {
              eval(response.webstatisticsCall)
            }
                // trigger an event at the end
            $('body').trigger( 'processResult:fail',
              [{
                errors: response.errors,
                originalFunction: originalFunction,
              }])
          }
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
        errorManager
          .showValidationErrors(response.validationErrors, {form: config.form})
        let idSequence = config.extraParams['idSequence']

        if (response && response.validationErrors) {
          for (let i=0; i<response.validationErrors.length; i++) {
            let property=response.validationErrors[i].property
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

            match = (
              property.indexOf('Address.state') != -1 &&
              property.indexOf('Address.state') ==
              property.lastIndexOf('Address.state')) > 0
            if (match) {
              let elements = document.getElementsByName(property+ 'Display')
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
        $('body').trigger( 'processPurchaseValidationErrorResult',
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
      let customFunction = function
        processValidationResponse(response, config) {
        let form = (typeof(config.form) === 'undefined' ||
          config.form === null) ?
            document.forms[SEND_CONFIRMATION_FORM_NAME] : config.form
        if (response.status !== 'success') {
            // reuse common functionality
          errorManager.showValidationErrors(response.validationErrors, {
            form: form,
            hideCommonErrorBlock: isSendItineraryFromPopup,
          })
            // trigger an event at the end
          $('body').trigger( 'processValidationResponse',
            [{
              errors: response,
              config: config,
              originalFunction: originalFunction,
            }])
        } else {
          errorManager.resetValidationErrors(form, isSendItineraryFromPopup)
            // send email
          ajax.request({
            url: ACTION_URL,
            form: form,
            success: processSend,
            error: processSend,
            options: INFO_SEND_TARGET_ELEMENT,
          })
          getFormElementById(form, INPUT_ID).enabled = false
          getFormElementById(form, INPUT_ID).disabled = true
          getFormElementById(form, BUTTON_SENDING_ID).style.display = 'block'
          getFormElementById(form, BUTTON_SEND_ID).style.display = 'none'
            // trigger an event at the end
        }
      }
      window.processValidationResponse = customFunction.bind(window)
    }

    hostProxyService.mockProcessSentConfirmationPage = function() {
      let originalFunction =
        window.processSend
      let customFunction = function processSend(response, config) {
        let form = (typeof(config.form) !== 'undefined' &&
          config.form !== null) ? config.form : null
        let targetElementId = config.options
        let targetElement = getFormElementById(form, targetElementId)
        let m3ErrTargetElement =
          getFormElementById(form, M3_ERRORS_TARGET_ELEMENT)
        let errTargetElement = getFormElementById(form, ERRORS_TARGET_ELEMENT)
        let input = getFormElementById(form, INPUT_ID)
        eval('var tContentData =' + response)
        if (tContentData.contentData.isError === 'false') {
          targetElement.innerHTML = tContentData.contentData.UpdateCont
          targetElement.style.display = 'block'
          m3ErrTargetElement.style.display = 'none'
          errTargetElement.style.display = 'none'
            // clear entered email address if configured
        }

        if (tContentData.contentData.isError === 'true') {
          m3ErrTargetElement.innerHTML = tContentData.contentData.UpdateCont
          targetElement.style.display = 'none'
          errTargetElement.style.display = 'none'
          m3ErrTargetElement.style.display = 'block'
        }

        getFormElementById(form, BUTTON_SENDING_ID).style.display = 'none'
        getFormElementById(form, BUTTON_SEND_ID).style.display = 'block'
        input.enabled = true
        input.disabled = false
          // trigger an event at the end
        $('body').trigger( 'processSend',
          [{
            contentData: tContentData.
            contentData,
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
