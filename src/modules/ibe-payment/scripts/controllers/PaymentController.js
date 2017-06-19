/* eslint-disable max-len,no-invalid-this */
'use strict'

define([
  'jquery',
  'angular',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  '../../../../scripts/filters/strDuration',
  '../../../../scripts/filters/strSimpleDate',
  '../../../../scripts/filters/sanitize',
  '../../../../scripts/filters/collUnique',
  '../../../../scripts/services/hostProxyService',
  '../../../../scripts/filters/range',
  '../../../../scripts/directives/jqui-dialog',
  'lodash',
  '../../../../scripts/directives/bs-card-ref-id',
  'statsService',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card-per-passenger',
  '../../../../scripts/services/hostUIService',
  '../../../../components/complex/bs-detail-seats-prices/index.component',
  '../../../../components/complex/bs-summary-seats-prices/index.component',
  '../../../../components/complex/bs-multiple-payment-selector/index.component',
  '../../../../components/complex/bs-payment-pse/index.component',
  '../../../../components/complex/bs-payment-bank-transfers/index.component',
  '../../../../components/complex/bs-payment-bank-slip/index.component',
], function($, angular, hostUIService, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService, range,
  jquiDialog, _, bsCardRefId, statsService, bsItineraryPricingCard,
  bsItineraryPricingCardPerPassenger, ApphostUIService, bsDetailSeatsPricesComponent,
  bsSummarySeatsPricesComponent, bsMultiplePaymentSelectorComponent, bsPaymentPseComponent,
  bsPaymentBankTransfersComponent, bsPaymentBankSlipComponent
  ) {
  let wrapperInstance = {}
  $.noConflict(true)

  wrapperInstance.init = function(config, actionConfig) {
    wrapperInstance.config = config
    wrapperInstance.actionConfig = actionConfig
  };

    /**
     * Angular Controller
     * @author devs@everymundo.com
     */
  (function() {
    /**
     * @param {Object} $scope
     * @param {Object} hostUIService
     * @param {Object} hostScrapService
     * @param {Object} hostProxyService
     * @param {Object} $timeout
     * @param {Object} appHostProxyService
     * @param {Object} $translate
     * @param {Object} $sce
     * @param {Object} ApphostUIService
     * @param {Object} $rootScope
     *
     * @return {Object}
     */
    function PaymentController($scope, hostUIService,
        hostScrapService, hostProxyService, $timeout, appHostProxyService,
        $translate, $sce, ApphostUIService, $rootScope) {
      let instance = this

        // allow to farenet bring back the prices html nodes to
      Farenet2.verbose = 1
        // populate the model with the Farenet values

      let model = Farenet2.parse()

        // view model
      let ui = {
        locations: getLocations(),
        total_price: model.total_price,
        discounts: model.discounts,
        user_input_journey_type: model.user_input_journey_type,
        total_price_per_passenger_type: model.total_price_per_passenger_type,
        passengers_info: hostScrapService.getPassengersInfo(),
        count_options: hostScrapService.getCantOptions,
        passengers: model.passengers,
        userIfLogged: hostScrapService.ifUserIsLogged(),
        disclaimer_mapping: _.isEmpty(model.disclaimer_mapping) ? null : model.disclaimer_mapping,
        messages: [],
        errors: {},
        sellingClass: {
          openDialog: false,
          html: $sce.trustAsHtml('<div> </div>'),
        },
        flightDetails: {
          openDialog: false,
          data: {},
        },
        showContinueButton: 1,
        showPaymentInformation: $('#reviewItineraryPopupLoadedContentDialog').length === 0,
        static_messages: {
          reviewItineraryDisclaimer: {
            type: '',
            head: 'Important',
            content: hostScrapService.getReviewItineraryDisclaimer(),
          },
          fbBillingInfoMessage: {
            type: '',
            head: 'Important',
            content: hostScrapService.getfbBillingInfoMessage(),

          },
          tbTermsConditionsMessage: {
            type: '',
            head: 'Important',
            content: hostScrapService.getTbTermsConditionsMessage(),
          },
          tbTermsConditionsLabel: {
            type: '',
            head: 'Important',
            content: hostScrapService.getTbTermsConditionsLabel(),
          },
          hazardousMaterialsAgreementMessage: {
            type: '',
            head: 'Important',
            content: hostScrapService.getHazardousMaterialsAgreementMessage(),
          },
          hazardousMaterialsAgreementLabel: {
            type: '',
            head: 'Important',
            content: hostScrapService.getHazardousMaterialsAgreementLabel(),
          },
          saveCreditCardLabel: {
            type: '',
            head: 'Important',
            content: hostScrapService.getSaveCreditCardLabel(),
          },
        },
        isPaymentCreditCardPosChecked: hostScrapService.isPaymentCreditCardPosChecked(),
        isPaymentBankTransferChecked: hostScrapService.isPaymentBankTransferChecked(),
        isCreditCardsSaved: hostScrapService.isCreditCardsSaved(),
        ifExistEditOption: hostScrapService.ifExistEditOption(),
        togglePaymentCreditCardPos: hostScrapService.togglePaymentCreditCardPos,
        togglePaymentBankTransfer: hostScrapService.togglePaymentBankTransfer,
        payment: buildCreditCardInfo(),
        agreements: buildAgreements(),
        partialErrors: {},
        card_images: hostScrapService.getCardImages(),
        creditCardLabel: hostScrapService.getCreditCardLabel(),
        /**
         * @param {Object} states
         */
        updateStates: (states) => {
          $timeout(() => {
            $scope.ui.states = angular.merge({}, $scope.ui.states, states)
          }, 0)
        },
        states: {
          pse: false,
          cc: true,
          bankTransfers: false,
          paymentBlocks: false,
          bankSlip: false,
        },
      }

      ui.total_price.base_fare = getBaseFare(model)

        // -------------------------------------------------------
        // starting code
        // -------------------------------------------------------

      instance.init = function() {
        console.log('PaymentController init')
      }

        // -------------------------------------------------------
        // binding properties
        // -------------------------------------------------------

      $scope.$parent.showMiniSummary = true
      $scope.$parent.stepper.goToStep(4)

      $scope.ui = ui

      // sync the ui height to garanty footer correct positioning
      appHostProxyService.syncHeight($timeout)

      statsService.ruleShowed(Farenet2.getResult(), wrapperInstance.actionConfig)

      if (_.isEmpty(ui.disclaimer_mapping)) {
        ui.disclaimer_mapping = null
      } else {
        /**
         * @param {Array} locationFlights
         * @return {Array}
         */
        const getDisclaimers = (locationFlights) => {
          let disclaimers = []
          locationFlights.flights.forEach(function(flight) {
            flight.info.flight_list.forEach(function(f) {
              f.disclaimer.forEach(function(d) {
                disclaimers.push({id: d.id})
              })
            })
          })
          return disclaimers
        }

        if (ui.locations.length > 1) {
          ui.locations = ui.locations.map(function(location) {
            location.disclaimers = getDisclaimers(location.departure.dates[0])
            return location
          })
        } else {
          ui.locations[0].disclaimers = [].concat(
              getDisclaimers(ui.locations[0].departure.dates[0])
            )
          if (ui.locations[0].return) {
            ui.locations[0].disclaimers = ui.locations[0].disclaimers.concat(
                getDisclaimers(ui.locations[0].return.dates[0])
              )
          }
        }
      }

        /**
         * @param {String} singleValue
         * @param {Object[]} options
         * @return {Object}
         */
      let getSelectedOption = function(singleValue, options) {
        let strValue = singleValue
        let value = null
        options.forEach(function(el) {
          if (el.value === strValue) {
            value = el
          }
        })
        if (!value) {
          value = options[0]
        }

        return value
      }


      let autoFillCardForm = function() {
        $timeout(function() {
          let inputsType = hostScrapService.getCreditCardInputsSelectorsType()

          let v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_TYPE)
          $scope.ui.payment.cardType = getSelectedOption(v, $scope.ui.payment.cardTypes)
          v = hostScrapService.getCreditCardValueByInput(inputsType.SAVED_CARD_SELECT)
          $scope.ui.payment.saved_card_select = getSelectedOption(v, $scope.ui.payment.savedCards)
          v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT)
          $scope.ui.payment.cardCountry = getSelectedOption(v, $scope.ui.payment.cardIssuingCountries)
          v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT)
          $scope.ui.payment.cardCurrency = getSelectedOption(v, $scope.ui.payment.cardCurrencies)
          v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH)
          $scope.ui.payment.edExpirationMonth = getSelectedOption(v, $scope.ui.payment.expirationDatesMonth)
          v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR)
          $scope.ui.payment.edExpirationYear = getSelectedOption(v, $scope.ui.payment.expirationDatesYear)
          v = hostScrapService.getCreditCardValueByInput(inputsType.BA_COUNTRY)
          $scope.ui.payment.baCountry = getSelectedOption(v, $scope.ui.payment.countries)
          $scope.ui.payment.cardHolderName = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_NAME)
          $scope.ui.payment.cardHolderPhoneCode = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC)
          $scope.ui.payment.cardHolderPhoneNumber = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER)
          $scope.ui.payment.cardHolderEmail = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL)
          $scope.ui.payment.baAddressLine1 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1)
          $scope.ui.payment.baAddressLine2 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2)
          $scope.ui.payment.baCity = hostScrapService.getCreditCardValueByInput(inputsType.BA_CITY)
          $scope.ui.payment.baPostalCode = hostScrapService.getCreditCardValueByInput(inputsType.BA_POSTAL_CODE)
        }, 200)
      };

        // function for initialize ui.payments porperties that depend of select elements
      (function() {
        let inputsType = hostScrapService.getCreditCardInputsSelectorsType()
        let v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_TYPE)
        $scope.ui.payment.cardType = getSelectedOption(v, $scope.ui.payment.cardTypes)
        v = hostScrapService.getCreditCardValueByInput(inputsType.SAVED_CARD_SELECT)
        $scope.ui.payment.saved_card_select = getSelectedOption(v, $scope.ui.payment.savedCards)
        v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT)
        $scope.ui.payment.cardCountry = getSelectedOption(v, $scope.ui.payment.cardIssuingCountries)
        v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT)
        $scope.ui.payment.cardCurrency = getSelectedOption(v, $scope.ui.payment.cardCurrencies)
        v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH)
        $scope.ui.payment.edExpirationMonth =
            getSelectedOption(v, $scope.ui.payment.expirationDatesMonth)
        v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR)
        $scope.ui.payment.edExpirationYear =
            getSelectedOption(v, $scope.ui.payment.expirationDatesYear)
        v = hostScrapService.getCreditCardValueByInput(inputsType.BA_COUNTRY)
        $scope.ui.payment.baCountry = getSelectedOption(v, $scope.ui.payment.countries)
        v = hostScrapService.getCreditCardValueByInput(inputsType.BA_STATE_DISPLAY)
        $scope.ui.payment.baStateDisplay = getSelectedOption(v, $scope.ui.payment.states)
      })()

        // app manipulation vars
      $scope.$parent.showLoading = false

        // -------------------------------------------------------
        // binding functions
        // -------------------------------------------------------

      $scope.acceptInformationContinueAction = function() {
        hostProxyService.acceptInformationContinueAction()
        $scope.ui.showPaymentInformation = 1

        let inputsType = hostScrapService.getCreditCardInputsSelectorsType()
        /**
         * Init Installments
         */
        function initInstallments() {
          $scope.ui.payment.installmentsOptions =
              hostScrapService.getCreditCardSelectOptionsByInput(inputsType.INSTALLMENTS)
          $scope.ui.payment.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments()
          if ($scope.ui.payment.isInstallmentsVisible) {
            $scope.ui.payment.installments = $scope.ui.payment.installmentsOptions[0]
          }
        }
        /**
         * Init Default CardValues
         */
        function initDefaultCardValues() {
          $scope.ui.payment.cardCurrencies =
              hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_CURRENCY_SELECT)
          if ($scope.ui.payment.cardCurrency && !$scope.ui.payment.cardCurrency.name) {
            $scope.ui.payment.cardCurrency = $scope.ui.payment.cardCurrencies[0]
          }
          $scope.ui.payment.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument()
          $scope.ui.payment.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId()
          $scope.ui.payment.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments()
        }

        $scope.focusToCardNumberIframe = function() {
          hostUIService.focusToCardNumberIframe()
        }

        $scope.focusToSecurityCodeIframe = function() {
          hostUIService.focusToSecurityCodeIframe()
        }

        $timeout(function() {
          initInstallments()
          initDefaultCardValues()

          $timeout(function() {
            hostUIService.syncIframeFields()
          }, 2000)
        }, 0)
      }

      $scope.ui.editableMode = function() {
        $scope.ui.isCreditCardsSaved = 0

        editPaymentCard()
        $scope.ui.agreements.checkBoxCreditCardStatus = false
        $scope.ui.agreements.checkBoxCreditCardStatus = $('#savePaymentCard').val()
        $timeout(function() {
          hostUIService.syncIframeFields()
        }, 2000)
      }

      $scope.addNewPaymentMode = function() {
        $scope.ui.isCreditCardsSaved = 0
        $scope.ui.agreements.checkBoxCreditCardStatus = false
        autoFillCardForm()
        addNewPayment()
        $timeout(function() {
          hostUIService.syncIframeFields()
        }, 2000)
      }

      $scope.ui.returnFromEditableMode = function() {
        $scope.ui.isCreditCardsSaved = 1
        autoFillCardForm()
        selectPaymentFromProfile()
        $timeout(function() {
          hostUIService.syncIframeFields()
        }, 2000)
      }

      $scope.continueButtonAction = function() {
        let formActionNodeSelector = hostProxyService.getFormActionNodeSelector()
        let paymentValidationDeferred = hostProxyService.bindPaymentValidation()
        let deferred = appHostProxyService.submitFormAction(formActionNodeSelector, 'payment')
        hostUIService.hideHostInterface()
        $scope.$parent.showLoading = true

        deferred.done(function(value) {
          validationHelper(value.errors)
          $timeout(function() {
            $scope.$parent.showLoading = false
            hostUIService.showHostInterface()
            hostUIService.syncPosition()
          }, 0)
        })

        paymentValidationDeferred.done(function(value) {
          validationHelper(value.errors)
          $timeout(function() {
            $scope.$parent.showLoading = false
            hostUIService.showHostInterface()
            hostUIService.syncPosition()
          }, 0)
        })
      }
      // -------------------------------------------------------
      // Helpers
      // -------------------------------------------------------

      // - model helpers
      /**
       * Augment the locations ViewModel with
       * the necessary properties for the UI like:
       * (selectedClassIndex, show, summary)
       * @return {Object}
       */
      function getLocations() {
        let locations = model.geo.location
        $.each(locations, function(index, value) {
          this.departure = model.departure[index]
          this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights)

          this.extra_info = {
            geo: model.extra_info.geo[index],
          }
          this.departure.selectedClassIndex = this.departure.availableClasses[0]
          this.departure.show = 1
          this.departure.done = 0
          this.departure.summary = {
            show: 0,
            departure_time: '',
            arrival_time: '',
            duration: 960,
            stops: 0,
            flight_list: [],
            price: 0,
          }

          if (model.return && model.return[index]) {
            this.return = model.return[index]
            this.return.show = 0
            this.return.done = 0
            this.return.summary = {
              show: 0,
              departure_time: '',
              arrival_time: '',
              duration: 300,
              stops: 0,
              flight_list: [],
              price: 0,
            }

            this.return.availableClasses =
                getAvailableClasses(this.return.dates[0].flights)
            this.return.selectedClassIndex = this.return.availableClasses[0]
          }
        })

        return locations
      }
     /**
      * @param {Array} flights
      * @return {Array}
      */
      function getAvailableClasses(flights) {
        let availableClasses = []
        if (flights.length > 0) {
          let cssClassesMapping = {
            'Economy Promo': 'flight-class-color--level1',
            'Economy Extra': 'flight-class-color--level2',
            'Economy Flex': 'flight-class-color--level3',
            'Business Promo': 'flight-class-color--level4',
            'Business Flex': 'flight-class-color--level5',
          }

            // this aproach asumes that the classes are
            // the same for all the fligths, that works for Copa
            // but we need to be carful in next implementations
          let firstFlightClasses = flights[0].info.classes || []
          $.each(firstFlightClasses, function(index, value) {
            let cheapestPrice = value.price.cash
            if (cheapestPrice === -1) {
              cheapestPrice = 'Non/Ava'
            } else if (cheapestPrice === -3) {
              cheapestPrice = ''
            }

            availableClasses.push({
              name: value.name,
              cheapestPrice: cheapestPrice,
              id: index,
              cssClass: cssClassesMapping[value.name],
            })
          })

          flights.forEach(function(flight) {
            flight.info.classes = flight.info.classes.map(function(cls) {
              // Selling Class
              let sellingClassLink = cls.sellingClassNode || []
              if (sellingClassLink.length > 0) {
                cls.sellingClass = {
                  text: sellingClassLink.text(),
                  onclick: function() {
                    hostUIService.swapToBSFillFareRuleTabCallback()
                    sellingClassLink[0].click()
                    $('#airFareRulesPopUpOuter').attr('style', 'display:none')
                    $('#popupShimOuter').attr('style', 'display:none')

                    $scope.ui.sellingClass.isLoading = true
                    $scope.ui.sellingClass.openDialog = true
                  },
                }
              }
              return cls
            })
            flight.info.flight_list.forEach(function(fInfo) {
              fInfo.onclick = function() {
                hostUIService.swapToBSFlightDetailsLoadCallback()
                fInfo.flightNumberNode[0].click()

                // This hide the dialog and shadow
                $timeout(function() {
                  $('#flightDetailsPopUpOuter').attr('style', 'display:none')
                  $('.dialogFooter .button2')[0].click()
                  $scope.ui.flightDetails.openDialog = true
                  $scope.ui.flightDetails.isLoading = true
                  $('#popupShimOuter').attr('style', 'display:none')
                }, 0)
              }
            })
          })
        }
        return availableClasses
      }

      hostUIService.setHandlerSellingClass(function(error, response) {
        if (error) {
          console.log('[error] Loading Selling Class Info')
        }

        $timeout(function() {
          $scope.ui.sellingClass.html = $sce.trustAsHtml(response)
          $scope.ui.sellingClass.isLoading = false
        }, 0)

        hostUIService.swapToOrgFillFareRuleTabCallback()

        let closeDialog = $('#airFareRulesPopUpOuter .dialogClose a')
        if (closeDialog.length > 0) {
          closeDialog[0].click()
        }
      })

      hostUIService.setHandlerFlightDetails(function(error, success) {
        if (error) {
          console.log('[error]', error)
          return
        }

        hostUIService.swapToOrgFlightDetailsCallbacks()

        $timeout(function() {
          $scope.ui.flightDetails.isLoading = false
          $scope.ui.flightDetails.data = success
        }, 0)
      })
      /**
       * @return {Object}
       */
      function buildCreditCardInfo() {
        let inputsType = hostScrapService.getCreditCardInputsSelectorsType()

        let creditCardInfo = {
          cardType: null,
          cardCountry: null,
          cardCurrency: null,
          edExpirationMonth: null,
          edExpirationYear: null,
          baCountry: null,
          baStateDisplay: null,
          cardHolderName: hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_NAME),
          cardNumber: hostScrapService.getCreditCardValueByInput(inputsType.CARD_NUMBER),
          securityCode: hostScrapService.getCreditCardValueByInput(inputsType.SECURITY_CODE),
          cardHolderPhoneCode:
            hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC),
          cardHolderPhoneNumber:
            hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER),
          cardHolderEmail:
            hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL),
          baAddressLine1:
            hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1),
          baAddressLine2:
            hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2),
          baCity:
            hostScrapService.getCreditCardValueByInput(inputsType.BA_CITY),
          baPostalCode:
            hostScrapService.getCreditCardValueByInput(inputsType.BA_POSTAL_CODE),
          isDocumentNumberVisible: hostScrapService.isVisibleRootDoument(),
          documentNumber:
            hostScrapService.getCreditCardValueByInput(inputsType.DOCUMENT_NUMBER),
          documentId:
            hostScrapService.getCreditCardValueByInput(inputsType.DOCUMENT_ID),
          isInstallmentsVisible: hostScrapService.isVisibleRootInstallments(),
          installments: null,

            // lists
          cardTypes:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_TYPE),
          savedCards:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.SAVED_CARD_SELECT),
          cardIssuingCountries:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT),
          cardCurrencies:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_CURRENCY_SELECT),
          expirationDatesMonth:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.ED_EXPIRATION_MONTH),
          expirationDatesYear:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.ED_EXPIRATION_YEAR),
          countries:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_COUNTRY),
          states:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_STATE_DISPLAY),
          installmentsOptions:
            hostScrapService.getCreditCardSelectOptionsByInput(inputsType.INSTALLMENTS),
            // setters
          setDocumentNumber: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.DOCUMENT_NUMBER, value)
            ui.partialErrors.documentNumber = null
          },
          setDocumentId: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.DOCUMENT_ID, value)
            ui.partialErrors.documentId = null
          },
          setCardType: function(value) {
            let self = this
            hostScrapService.setCreditCardValueByInput(inputsType.CARD_TYPE, value.value)
            $timeout(function() {
              self.cardIssuingCountries =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT)
              self.cardCountry = self.cardIssuingCountries[0]
              ui.partialErrors.cardType = null
              $timeout(function() {
                hostUIService.syncPosition()
              }, 2)
            }, 1000)
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setSavedCardsList: function(value) {
            let self = this
            let inputsType = hostScrapService.getCreditCardInputsSelectorsType()
            hostScrapService.setCreditCardValueByInput(inputsType.SAVED_CARD_SELECT, value.value)
            ui.partialErrors.savedCardSelect = null
            $timeout(function() {
              let v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_TYPE)
              self.cardType = getSelectedOption(v, self.cardTypes)

              v = hostScrapService.getCreditCardValueByInput(inputsType.BA_COUNTRY)
              self.baCountry = getSelectedOption(v, self.countries)

              $timeout(function() {
                let v = hostScrapService.getCreditCardValueByInput(inputsType.BA_STATE_DISPLAY)
                self.baStateDisplay = getSelectedOption(v, self.states)
              }, 1000)

              v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT)
              self.cardCountry = getSelectedOption(v, self.cardIssuingCountries)
              v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT)
              self.cardCurrency = getSelectedOption(v, self.cardCurrencies)
              v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH)
              self.edExpirationMonth = getSelectedOption(v, self.expirationDatesMonth)
              v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR)
              self.edExpirationYear = getSelectedOption(v, self.expirationDatesYear)


              self.cardHolderName = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_NAME)
              self.cardHolderPhoneCode = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC)
              self.cardHolderPhoneNumber = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER)
              self.cardHolderEmail = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL)
              self.baAddressLine1 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1)
              self.baAddressLine2 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2)
              self.baCity = hostScrapService.getCreditCardValueByInput(inputsType.BA_CITY)
              self.baPostalCode = hostScrapService.getCreditCardValueByInput(inputsType.BA_POSTAL_CODE)

              hostUIService.syncPosition()
            }, 2)
          },
          setCardHolderName: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_NAME, value)
            ui.partialErrors.cardHolderName = null
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setCardNumber: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.CARD_NUMBER, value)
            ui.partialErrors.cardNumber = null
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setEdExpirationMonth: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH, value.value)
            ui.partialErrors.edExpirationMonth = null
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setEdExpirationYear: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR, value.value)
            ui.partialErrors.edExpirationYear = null
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setSecurityCode: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.SECURITY_CODE, value)
            ui.partialErrors.securityCode = null
            $timeout(function() {
              hostUIService.syncPosition()
            }, 2)
          },
          setCardHolderPhoneCode: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC, value)
            ui.partialErrors.cardHolderPhoneCode = null
          },
          setCardHolderPhoneNumber: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER, value)
            ui.partialErrors.cardHolderPhoneNumber = null
          },
          setCardHolderEmail: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL, value)
            ui.partialErrors.cardHolderEmail = null
          },
          setBaAddressLine1: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1, value)
            ui.partialErrors.baAddressLine1 = null
          },
          setBaAddressLine2: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2, value)
            ui.partialErrors.baAddressLine2 = null
          },
          setBaCity: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.BA_CITY, value)
            ui.partialErrors.baCity = null
          },
          setBaCountry: function(value) {
            let self = this
            hostScrapService.setCreditCardValueByInput(inputsType.BA_COUNTRY, value.value)
            $timeout(function() {
              self.states = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_STATE_DISPLAY)
              self.baStateDisplay = self.states[0]
              ui.partialErrors.baCountry = null
            }, 1000)
          },
          setCardCountry: function(value) {
            let self = this
            hostScrapService.setCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT, value)
            $timeout(function() {
              self.cardCurrencies =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_CURRENCY_SELECT)
              self.cardCurrency = self.cardCurrencies[0]
              self.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument()
              self.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId()
              self.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments()
              ui.partialErrors.cardCountry = null
              $timeout(function() {
                hostUIService.syncPosition()
              }, 1)
            }, 500)
            $timeout(function() {
              hostUIService.syncPosition()
            }, 1)
          },
          setCardCurrency: function(value) {
            let self = this
            let deferred = hostProxyService.bindCardCurrency()

            deferred.done(function(value) {
              $timeout(function() {
                if (value.response && value.response.equivTotalText) {
                  // le pongo el valor al texto que viene
                  ui.payment.cardCurrency.equivTotalText = value.response.equivTotalText
                } else {
                  ui.payment.cardCurrency.equivTotalText = ''
                }
                $timeout(function() {
                  hostUIService.syncPosition()
                }, 3)
              }, 0)
            })


            hostScrapService.setCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT, value)
            ui.partialErrors.cardCurrency = null
            ui.payment.cardCurrency.equivTotalText = ''

            $timeout(function() {
              self.installmentsOptions =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.INSTALLMENTS)
              self.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments()
              if (self.isInstallmentsVisible) {
                self.installments = self.installmentsOptions[0]
              }
            }, 0)

            $timeout(function() {
              hostUIService.syncPosition()
            }, 1)
          },
          setInstallments: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.INSTALLMENTS, value)
            ui.partialErrors.installments = null
          },
          setBaStateDisplay: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.BA_STATE_DISPLAY, value.value)
            ui.partialErrors.baStateDisplay = null
          },
          setBaPostalCode: function(value) {
            hostScrapService.setCreditCardValueByInput(inputsType.BA_POSTAL_CODE, value)
            ui.partialErrors.baPostalCode = null
          },
        }

        creditCardInfo.cardType = setDefauldValueOnList(
            creditCardInfo.cardType, creditCardInfo.cardTypes
          )
        creditCardInfo.edExpirationMonth = setDefauldValueOnList(
            creditCardInfo.edExpirationMonth, creditCardInfo.expirationDatesMonth
          )
        creditCardInfo.edExpirationYear = setDefauldValueOnList(
            creditCardInfo.edExpirationYear, creditCardInfo.expirationDatesYear
          )
        creditCardInfo.country = setDefauldValueOnList(
            creditCardInfo.country, creditCardInfo.countries
          )
        creditCardInfo.baStateDisplay = setDefauldValueOnList(
            creditCardInfo.baStateDisplay, creditCardInfo.states
          )
        creditCardInfo.cardCountry = setDefauldValueOnList(
            creditCardInfo.cardCountry, creditCardInfo.cardIssuingCountries
          )
        creditCardInfo.cardCurrency = setDefauldValueOnList(
            creditCardInfo.cardCurrency, creditCardInfo.cardCurrencies
          )

        creditCardInfo.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument()
        creditCardInfo.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId()
        creditCardInfo.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments()

          // activate card payment by defauld
        hostScrapService.togglePaymentCreditCardPos()

        return creditCardInfo
      }
      /**
       * @param {Object} value
       * @param {Array} collection
       * @return {Object}
       */
      function setDefauldValueOnList(value, collection) {
        if (value !== '') {
          collection.forEach(function(item) {
            if (item.value === value) {
              return item
            }
          })
        } else {
          return collection[0]
        }
      }
      /**
       * Add the validation messages to the UI
       * errors: {
       *   validationErrors: [
       *     {
       *       messages:['you must provide origin'],
       *       property: "outboundOption.originLocationCode"
       *     },
       *     {
       *       messages:['you must provide origin']
       *     }
       *   ]
       * }
       * @param  {Array} errors [description]
       */
      function validationHelper(errors) {
        let validationErrors = errors.validationErrors
        ui.errors = []
        ApphostUIService.scrollToTop()
        if (!validationErrors && errors.errors) {
          validationErrors = errors.errors
        }

        if (!validationErrors && errors.length > 0) {
          validationErrors = []
          $.each(errors, function() {
            validationErrors.push({
              messages: [
                this.message,
              ],
            })
          })
        }
        $scope.ui.messages = []
        $.each(validationErrors, function(/* value, index*/) {
          let message = this
          if (message.property) {
              // validate an specific input
              // TODO: Implement this feature
            addMessageToInput(message.property, message.messages[0])
          } else if (message.key) {
              // add the message to the general messages
            $scope.ui.messages.push(
              {
                type: 'error',
                content: message.message,
              }
              )
          } else {
              // add the message to the general messages
            $scope.ui.messages.push(
              {
                type: 'error',
                content: message.messages[0],
              }
              )
          }
        })
        $rootScope.$broadcast('view-validation:partialErrors', ui.partialErrors)
        $scope.$apply()
      }

      /**
       * @param {String} propertyName
       * @param {String} message
       */
      function addMessageToInput(propertyName, message) {
          // propertyName = formOfPayment(CREDITCARD_POS).number;
        let inputType =
            hostScrapService.getTypeByFieldAttrName(propertyName)
        let selectorsTypes =
            hostScrapService.getCreditCardInputsSelectorsType()

        if (inputType === selectorsTypes.CARD_TYPE) {
          ui.partialErrors.cardType = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARD_ISSUING_COUNTRY_SELECT) {
          ui.partialErrors.cardCountry = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARD_CURRENCY_SELECT) {
          ui.partialErrors.cardCurrency = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARDHOLDER_NAME) {
          ui.partialErrors.cardHolderName = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARD_NUMBER) {
          ui.partialErrors.cardNumber = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARD_NUMBER_INPUT) {
          ui.partialErrors.cardNumber = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.ED_EXPIRATION_MONTH) {
          ui.partialErrors.edExpirationMonth = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.ED_EXPIRATION_YEAR) {
          ui.partialErrors.edExpirationYear = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.SECURITY_CODE) {
          ui.partialErrors.securityCode = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.SECURITY_CODE_INPUT) {
          ui.partialErrors.securityCode = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.CARDHOLDER_PHONE_CC) {
          ui.partialErrors.cardHolderPhoneCode = message
        } else if (inputType === selectorsTypes.CARDHOLDER_PHONE_NUMBER) {
          ui.partialErrors.cardHolderPhoneNumber = message
        } else if (inputType === selectorsTypes.CARDHOLDER_EMAIL) {
          ui.partialErrors.cardHolderEmail = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_ADDRESS_LINE_1) {
          ui.partialErrors.baAddressLine1 = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_ADDRESS_LINE_2) {
          ui.partialErrors.baAddressLine2 = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_CITY) {
          ui.partialErrors.baCity = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_COUNTRY) {
          ui.partialErrors.baCountry = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_STATE_DISPLAY) {
          ui.partialErrors.baStateDisplay = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.BA_POSTAL_CODE) {
          ui.partialErrors.baPostalCode = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === 'TERMS_CONDITIONS') {
          ui.partialErrors.termsConditions = message
        } else if (inputType === 'HAZARDOUS_MATERIALS') {
          ui.partialErrors.hazardousMaterials = message
        } else if (propertyName === 'formOfPaymentProperty') {
          ui.partialErrors.notActivePaymentMethod = hostScrapService.checkCopaError(propertyName, message)
        } else if (propertyName === selectorsTypes.INSTALLMENTS) {
          ui.partialErrors.installments = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.DOCUMENT_NUMBER) {
          ui.partialErrors.documentNumber = hostScrapService.checkCopaError(propertyName, message)
        } else if (inputType === selectorsTypes.DOCUMENT_ID) {
          ui.partialErrors.documentId = hostScrapService.checkCopaError(propertyName, message)
        } else {
          if(propertyName) {
            const fieldKey = propertyName.match(/^.*\.{1}(.*)/)[1]
            ui.partialErrors[fieldKey] = message
          }
        }

        // formOfPaymentProperty
        // formOfPayment(CREDITCARD_POS).number
      }

     /**
      * @return {Object}
      */
      function buildAgreements() {
        return {
          termsConditions:
            hostScrapService.getAgreementsValueByInput('TERMS_CONDITIONS'),
          hazardousMaterials:
            hostScrapService.getAgreementsValueByInput('HAZARDOUS_MATERIALS'),
          saveCreditCard:
            hostScrapService.getAgreementsValueByInput('CREDIT_CARD'),
          checkBoxCreditCardStatus: false,
          checkedSaveCreditCard: function() {
            hostScrapService.checkedSaveCreditCard()
              // this.checkBoxCreditCardStatus = $('#savePaymentCard').val();
              // ui.partialErrors.termsConditions = null;
          },
          acceptTermsAndConditions: function() {
            hostScrapService.acceptTermsAndConditions()
            ui.partialErrors.termsConditions = null
          },
          acceptHazardousMaterials: function() {
            hostScrapService.acceptHazardousMaterials()
            ui.partialErrors.hazardousMaterials = null
          },
        }
      }
      /**
       * @param {Object} model
       * @return {Object}
       */
      function getBaseFare(model) {
        let totalPriceModel = model.total_price
        let discountsModel = model.discounts
        let baseFare = 0
        baseFare = totalPriceModel.cash - totalPriceModel.taxes - totalPriceModel.fuel_surcharges
        $.each(discountsModel, function(index, item) {
          baseFare += item.price
        })
        return baseFare
      }

        // - visual helpers

        // -------------------------------------------------------
        // listeners
        // -------------------------------------------------------
      instance.init()
      return instance
    }

    PaymentController.$inject = [
      '$scope',
      'hostUIService',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$translate',
      '$sce',
      'ApphostUIService',
      '$rootScope',
    ]
    angular
        .module('responsiveBookingEngine')
        .factory('hostUIService', hostUIService)
        .filter('duration', strDuration)
        .filter('simpledate', strSimpleDate)
        .filter('range', range)
        .filter('sanitize', sanitize)
        .filter('unique', collUnique)
        .directive('jquiDialog', jquiDialog)
        .directive('bsCardRefId', bsCardRefId)
        .directive('bsItineraryPricingCard', bsItineraryPricingCard)
        .directive('bsItineraryPricingCardPerPassenger', bsItineraryPricingCardPerPassenger)
        .component('bsDetailSeatsPricesComponent', bsDetailSeatsPricesComponent)
        .component('bsSummarySeatsPricesComponent', bsSummarySeatsPricesComponent)
        .component('bsMultiplePaymentSelectorComponent', bsMultiplePaymentSelectorComponent)
        .component('bsPaymentPseComponent', bsPaymentPseComponent)
        .component('bsPaymentBankTransfersComponent', bsPaymentBankTransfersComponent)
        .component('bsPaymentBankSlipComponent', bsPaymentBankSlipComponent)
        .controller('PaymentController', PaymentController)
  })({})

  return wrapperInstance
})
