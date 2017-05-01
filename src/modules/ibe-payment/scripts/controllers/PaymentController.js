// jshint -W003
// jshint -W072
'use strict';

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
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card-per-passenger'
], function ($, angular, hostUIService, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService, range,
  jquiDialog, _, bsCardRefId, statsService, bsItineraryPricingCard,
  bsItineraryPricingCardPerPassenger) {

    var wrapperInstance = {};
    $.noConflict(true);

    wrapperInstance.init = function (config, actionConfig) {
      wrapperInstance.config = config;
      wrapperInstance.actionConfig = actionConfig;
    };

    /**
     * Angular Controller
     * @author devs@everymundo.com
     */
    (function () {
      function PaymentController($scope, hostUIService,
        hostScrapService, hostProxyService, $timeout, appHostProxyService,
        $translate, $sce) {

        var instance = this;

        // allow to farenet bring back the prices html nodes to
        Farenet2.verbose = 1;
        // populate the model with the Farenet values
        var model = Farenet2.parse();

        // view model
        var ui = {
          locations: getLocations(),
          total_price: model.total_price,
          discounts: model.discounts,
          user_input_journey_type: model.user_input_journey_type,
          total_price_per_passenger_type: model.total_price_per_passenger_type,
          passengers_info: hostScrapService.getPassengersInfo(),
          passengers: model.passengers,
          disclaimer_mapping: _.isEmpty(model.disclaimer_mapping) ? null : model.disclaimer_mapping,
          messages: [],
          errors: {},
          sellingClass: {
            openDialog: false,
            html: $sce.trustAsHtml('<div> </div>')
          },
          flightDetails: {
            openDialog: false,
            data: {}
          },
          showContinueButton: 1,
          showPaymentInformation: 0,
          static_messages: {
            reviewItineraryDisclaimer: {
              type: '',
              head: 'Important',
              content: hostScrapService.getReviewItineraryDisclaimer()
            },
            fbBillingInfoMessage: {
              type: '',
              head: 'Important',
              content: hostScrapService.getfbBillingInfoMessage()
            },
            tbTermsConditionsMessage: {
              type: '',
              head: 'Important',
              content: hostScrapService.getTbTermsConditionsMessage()
            },
            tbTermsConditionsLabel: {
              type: '',
              head: 'Important',
              content: hostScrapService.getTbTermsConditionsLabel()
            },
            hazardousMaterialsAgreementMessage: {
              type: '',
              head: 'Important',
              content: hostScrapService.getHazardousMaterialsAgreementMessage()
            },
            hazardousMaterialsAgreementLabel: {
              type: '',
              head: 'Important',
              content: hostScrapService.getHazardousMaterialsAgreementLabel()
            },
            saveCreditCardLabel: {
              type: '',
              head: 'Important',
              content: hostScrapService.getSaveCreditCardLabel()
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
          creditCardLabel: hostScrapService.getCreditCardLabel()
        };

        ui.total_price.base_fare = getBaseFare(model);

        //-------------------------------------------------------
        // starting code
        //-------------------------------------------------------

        instance.init = function () {
          console.log('PaymentController init');
        };

        //-------------------------------------------------------
        // binding properties
        //-------------------------------------------------------

        $scope.$parent.showMiniSummary = true;
        $scope.$parent.stepper.goToStep(4);

        $scope.ui = ui;


        // sync the ui height to garanty footer correct positioning
        appHostProxyService.syncHeight($timeout);

        statsService.ruleShowed(Farenet2.getResult(), wrapperInstance.actionConfig);

        if (isEmpty(ui.disclaimer_mapping)) {
          ui.disclaimer_mapping = null;
        } else {
          function getDisclaimers(locationFlights) {
            var disclaimers = [];
            locationFlights.flights.forEach(function (flight) {
              flight.info.flight_list.forEach(function (f) {
                f.disclaimer.forEach(function (d) {
                  disclaimers.push({ id: d.id });
                });
              });
            });
            return disclaimers;
          }

          if (ui.locations.length > 1) {
            ui.locations = ui.locations.map(function (location) {
              location.disclaimers = getDisclaimers(location.departure.dates[0]);
              return location;
            });
          } else {
            ui.locations[0].disclaimers = [].concat(
              getDisclaimers(ui.locations[0].departure.dates[0])
            );
            if (ui.locations[0].return) {
              ui.locations[0].disclaimers = ui.locations[0].disclaimers.concat(
                getDisclaimers(ui.locations[0].return.dates[0])
              );
            }
          }
        }

        /**
         * @param {String} singleValue
         * @param {Object[]} options
         * @return {Object}
         */
        var getSelectedOption = function (singleValue, options) {
          var strValue = singleValue;
          var value = null;
          options.forEach(function (el) {
            if (el.value === strValue) {
              value = el;
            }
          });
          if (!value) {
            value = options[0];
          }

          return value;
        };

        // function for initialize ui.payments porperties that depend of select elements
        (function () {
          var inputsType = hostScrapService.getCreditCardInputsSelectorsType();
          var v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_TYPE);
          $scope.ui.payment.cardType = getSelectedOption(v, $scope.ui.payment.cardTypes);
          var v = hostScrapService.getCreditCardValueByInput(inputsType.SAVED_CARD_SELECT);
          $scope.ui.payment.saved_card_select = getSelectedOption(v, $scope.ui.payment.savedCards);
          v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT);
          $scope.ui.payment.cardCountry = getSelectedOption(v, $scope.ui.payment.cardIssuingCountries);
          v = hostScrapService.getCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT);
          $scope.ui.payment.cardCurrency = getSelectedOption(v, $scope.ui.payment.cardCurrencies);
          v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH);
          $scope.ui.payment.edExpirationMonth =
            getSelectedOption(v, $scope.ui.payment.expirationDatesMonth);
          v = hostScrapService.getCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR);
          $scope.ui.payment.edExpirationYear =
            getSelectedOption(v, $scope.ui.payment.expirationDatesYear);
          v = hostScrapService.getCreditCardValueByInput(inputsType.BA_COUNTRY);
          $scope.ui.payment.baCountry = getSelectedOption(v, $scope.ui.payment.countries);
          v = hostScrapService.getCreditCardValueByInput(inputsType.BA_STATE_DISPLAY);
          $scope.ui.payment.baStateDisplay = getSelectedOption(v, $scope.ui.payment.states);

        })();

        // app manipulation vars
        $scope.$parent.showLoading = false;

        //-------------------------------------------------------
        // binding functions
        //-------------------------------------------------------

        $scope.acceptInformationContinueAction = function () {
          hostProxyService.acceptInformationContinueAction();
          $scope.ui.showPaymentInformation = 1;

          var inputsType = hostScrapService.getCreditCardInputsSelectorsType();

          function initInstallments() {
            $scope.ui.payment.installmentsOptions =
              hostScrapService.getCreditCardSelectOptionsByInput(inputsType.INSTALLMENTS);
            $scope.ui.payment.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments();
            if ($scope.ui.payment.isInstallmentsVisible) {
              $scope.ui.payment.installments = $scope.ui.payment.installmentsOptions[0];
            }
          }

          function initDefaultCardValues() {
            $scope.ui.payment.cardCurrencies =
              hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_CURRENCY_SELECT);
            if ($scope.ui.payment.cardCurrency && !$scope.ui.payment.cardCurrency.name) {
              $scope.ui.payment.cardCurrency = $scope.ui.payment.cardCurrencies[0];
            }
            $scope.ui.payment.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument();
            $scope.ui.payment.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId();
            $scope.ui.payment.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments();
          }

          $scope.focusToCardNumberIframe = function () {
            console.log('focusToCardNumberIframe');
            hostUIService.focusToCardNumberIframe();
          }

          $scope.focusToSecurityCodeIframe = function () {
            console.log('focusToCardNumberIframe');
            hostUIService.focusToSecurityCodeIframe();
          }

          $timeout(function () {
            initInstallments();
            initDefaultCardValues();

            $timeout(function () {
              hostUIService.syncIframeFields();
            }, 2000);
          }, 0);

        };

        $scope.ui.editableMode = function () {
          $scope.ui.isCreditCardsSaved = 0;
          editPaymentCard();
          $timeout(function () {
            hostUIService.syncIframeFields();
          }, 2000);
        };

        $scope.ui.returnFromEditableMode = function () {
          $scope.ui.isCreditCardsSaved = 1;
          selectPaymentFromProfile();
          $timeout(function () {
            hostUIService.syncIframeFields();
          }, 2000);
        };

        $scope.continueButtonAction = function () {
          var formActionNodeSelector = hostProxyService.getFormActionNodeSelector();
          var paymentValidationDeferred = hostProxyService.bindPaymentValidation();
          var deferred = appHostProxyService.submitFormAction(formActionNodeSelector, 'payment');
          hostUIService.hideHostInterface();
          $scope.$parent.showLoading = true;
          deferred.done(function (value) {
            validationHelper(value.errors);
            $timeout(function () {
              $scope.$parent.showLoading = false;
              hostUIService.showHostInterface();
              hostUIService.syncPosition();
            }, 0);
          });

          paymentValidationDeferred.done(function (value) {
            validationHelper(value.errors);
            $timeout(function () {
              $scope.$parent.showLoading = false;
              hostUIService.showHostInterface();
              hostUIService.syncPosition();
            }, 0);
          });
        };

        //-------------------------------------------------------
        // Helpers
        //-------------------------------------------------------

        // - model helpers
        /**
         * @return {Object[]}
         */
        function getPassengers() {
        }

        /**
         * Augment the locations ViewModel with
         * the necessary properties for the UI like:
         * (selectedClassIndex, show, summary)
         * @return
         */
        function getLocations() {
          var locations = model.geo.location;
          $.each(locations, function (index, value) {
            this.departure = model.departure[index];
            this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights);

            this.extra_info = {
              geo: model.extra_info.geo[index]
            };
            this.departure.selectedClassIndex = this.departure.availableClasses[0];
            this.departure.show = 1;
            this.departure.done = 0;
            this.departure.summary = {
              show: 0,
              departure_time: '',
              arrival_time: '',
              duration: 960,
              stops: 0,
              flight_list: [],
              price: 0
            };

            if (model.return && model.return[index]) {
              this.return = model.return[index];
              this.return.show = 0;
              this.return.done = 0;
              this.return.summary = {
                show: 0,
                departure_time: '',
                arrival_time: '',
                duration: 300,
                stops: 0,
                flight_list: [],
                price: 0
              };

              this.return.availableClasses =
                getAvailableClasses(this.return.dates[0].flights);
              this.return.selectedClassIndex = this.return.availableClasses[0];
            }
          });

          return locations;
        }

        function getAvailableClasses(flights) {
          var availableClasses = [];
          if (flights.length > 0) {
            var cssClassesMapping = {
              'Economy Promo': 'flight-class-color--level1',
              'Economy Extra': 'flight-class-color--level2',
              'Economy Flex': 'flight-class-color--level3',
              'Business Promo': 'flight-class-color--level4',
              'Business Flex': 'flight-class-color--level5'
            };

            // this aproach asumes that the classes are
            // the same for all the fligths, that works for Copa
            // but we need to be carful in next implementations
            var firstFlightClasses = flights[0].info.classes || [];
            $.each(firstFlightClasses, function (index, value) {
              var cheapestPrice = value.price.cash;
              if (cheapestPrice === -1) {
                cheapestPrice = 'Non/Ava';
              } else if (cheapestPrice === -3) {
                cheapestPrice = '';
              }

              availableClasses.push({
                name: value.name,
                cheapestPrice: cheapestPrice,
                id: index,
                cssClass: cssClassesMapping[value.name],
              });
            });

            flights.forEach(function (flight) {
              flight.info.classes = flight.info.classes.map(function (cls) {
                // Selling Class
                var sellingClassLink = cls.sellingClassNode;
                if (sellingClassLink.length > 0) {
                  cls.sellingClass = {
                    text: sellingClassLink.text(),
                    onclick: function () {
                      hostUIService.swapToBSFillFareRuleTabCallback();
                      sellingClassLink[0].click();
                      $('#airFareRulesPopUpOuter').attr('style', 'display:none');
                      $('#popupShimOuter').attr('style', 'display:none');

                      $scope.ui.sellingClass.isLoading = true;
                      $scope.ui.sellingClass.openDialog = true;
                    }
                  };
                }
                return cls;
              });
              flight.info.flight_list.forEach(function (fInfo) {
                fInfo.onclick = function () {
                  hostUIService.swapToBSFlightDetailsLoadCallback();
                  fInfo.flightNumberNode[0].click();

                  // This hide the dialog and shadow
                  $timeout(function () {
                    $('#flightDetailsPopUpOuter').attr('style', 'display:none');
                    $('.dialogFooter .button2')[0].click();
                    $scope.ui.flightDetails.openDialog = true;
                    $scope.ui.flightDetails.isLoading = true;
                    $('#popupShimOuter').attr('style', 'display:none');
                  }, 0);
                };
              });
            });
          }
          return availableClasses;
        }

        hostUIService.setHandlerSellingClass(function (error, response) {
          if (error) {
            console.log('[error] Loading Selling Class Info');
          }

          $timeout(function () {
            $scope.ui.sellingClass.html = $sce.trustAsHtml(response);
            $scope.ui.sellingClass.isLoading = false;
          }, 0);

          hostUIService.swapToOrgFillFareRuleTabCallback();

          var closeDialog = $('#airFareRulesPopUpOuter .dialogClose a');
          if (closeDialog.length > 0) {
            closeDialog[0].click();
          }
        });

        hostUIService.setHandlerFlightDetails(function (error, success) {
          if (error) {
            console.log('[error]', error);
            return;
          }

          hostUIService.swapToOrgFlightDetailsCallbacks();

          $timeout(function () {
            $scope.ui.flightDetails.isLoading = false;
            $scope.ui.flightDetails.data = success;
          }, 0);
        });

        function buildCreditCardInfo() {
          var inputsType = hostScrapService.getCreditCardInputsSelectorsType();

          var creditCardInfo = {
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
            setDocumentNumber: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.DOCUMENT_NUMBER, value);
              ui.partialErrors.documentNumber = null;
            },
            setDocumentId: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.DOCUMENT_ID, value);
              ui.partialErrors.documentId = null;
            },
            setCardType: function (value) {
              var self = this;
              hostScrapService.setCreditCardValueByInput(inputsType.CARD_TYPE, value.value);
              $timeout(function () {
                self.cardIssuingCountries =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT);
                self.cardCountry = self.cardIssuingCountries[0];
                ui.partialErrors.cardType = null;
                $timeout(function () {
                  hostUIService.syncPosition();
                }, 2);
              }, 1000);
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setSavedCardsList: function (value) {
              var self = this;
              hostScrapService.setCreditCardValueByInput(inputsType.SAVED_CARD_SELECT, value.value);
              ui.partialErrors.savedCardSelect = null;
              $timeout(function () {
                self.cardIssuingCountries = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT);
                self.cardTypes = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_TYPE);
                self.countries = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_COUNTRY);
                self.expirationDatesMonth = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.ED_EXPIRATION_MONTH);
                self.expirationDatesYear = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.ED_EXPIRATION_YEAR);
                $timeout(function () {
                  self.states = hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_STATE_DISPLAY);
                }, 10);
                self.cardHolderName = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_NAME);
                self.cardHolderPhoneCode = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC);
                self.cardHolderPhoneNumber = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER);
                self.cardHolderEmail = hostScrapService.getCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL);
                self.baAddressLine1 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1);
                self.baAddressLine2 = hostScrapService.getCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2);
                self.baCity = hostScrapService.getCreditCardValueByInput(inputsType.BA_CITY);
                self.baPostalCode = hostScrapService.getCreditCardValueByInput(inputsType.BA_POSTAL_CODE);

                hostUIService.syncPosition();
              }, 2);
            },
            setCardHolderName: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_NAME, value);
              ui.partialErrors.cardHolderName = null;
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setCardNumber: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.CARD_NUMBER, value);
              ui.partialErrors.cardNumber = null;
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setEdExpirationMonth: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.ED_EXPIRATION_MONTH, value.value);
              ui.partialErrors.edExpirationMonth = null;
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setEdExpirationYear: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.ED_EXPIRATION_YEAR, value.value);
              ui.partialErrors.edExpirationYear = null;
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setSecurityCode: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.SECURITY_CODE, value);
              ui.partialErrors.securityCode = null;
              $timeout(function () {
                hostUIService.syncPosition();
              }, 2);
            },
            setCardHolderPhoneCode: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_CC, value);
              ui.partialErrors.cardHolderPhoneCode = null;
            },
            setCardHolderPhoneNumber: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_PHONE_NUMBER, value);
              ui.partialErrors.cardHolderPhoneNumber = null;
            },
            setCardHolderEmail: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.CARDHOLDER_EMAIL, value);
              ui.partialErrors.cardHolderEmail = null;
            },
            setBaAddressLine1: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_1, value);
              ui.partialErrors.baAddressLine1 = null;
            },
            setBaAddressLine2: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.BA_ADDRESS_LINE_2, value);
              ui.partialErrors.baAddressLine2 = null;
            },
            setBaCity: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.BA_CITY, value);
              ui.partialErrors.baCity = null;
            },
            setBaCountry: function (value) {
              var self = this;
              hostScrapService.setCreditCardValueByInput(inputsType.BA_COUNTRY, value);
              $timeout(function () {
                self.states =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.BA_STATE_DISPLAY);
                self.baStateDisplay = self.states[0];
                ui.partialErrors.baCountry = null;
              }, 1000);
            },
            setCardCountry: function (value) {
              var self = this;
              hostScrapService.setCreditCardValueByInput(inputsType.CARD_ISSUING_COUNTRY_SELECT, value);
              $timeout(function () {
                self.cardCurrencies =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.CARD_CURRENCY_SELECT);
                self.cardCurrency = self.cardCurrencies[0];
                self.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument();
                self.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId();
                self.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments();
                ui.partialErrors.cardCountry = null;
                $timeout(function () {
                  hostUIService.syncPosition();
                }, 1);
              }, 500);
              $timeout(function () {
                hostUIService.syncPosition();
              }, 1);
            },
            setCardCurrency: function (value) {
              var self = this;
              var deferred = hostProxyService.bindCardCurrency();

              deferred.done(function (value) {
                $timeout(function () {
                  if (value.response && value.response.equivTotalText) {
                    // le pongo el valor al texto que viene
                    ui.payment.cardCurrency.equivTotalText = value.response.equivTotalText;
                  } else {
                    ui.payment.cardCurrency.equivTotalText = '';
                  }
                  $timeout(function () {
                    hostUIService.syncPosition();
                  }, 3);
                }, 0);
              });


              hostScrapService.setCreditCardValueByInput(inputsType.CARD_CURRENCY_SELECT, value);
              ui.partialErrors.cardCurrency = null;
              ui.payment.cardCurrency.equivTotalText = '';

              $timeout(function () {
                self.installmentsOptions =
                  hostScrapService.getCreditCardSelectOptionsByInput(inputsType.INSTALLMENTS);
                self.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments();
                if (self.isInstallmentsVisible) {
                  self.installments = self.installmentsOptions[0];
                }
              }, 0);

              $timeout(function () {
                hostUIService.syncPosition();
              }, 1);
            },
            setInstallments: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.INSTALLMENTS, value);
              ui.partialErrors.installments = null;
            },
            setBaStateDisplay: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.BA_STATE_DISPLAY, value);
              ui.partialErrors.baStateDisplay = null;
            },
            setBaPostalCode: function (value) {
              hostScrapService.setCreditCardValueByInput(inputsType.BA_POSTAL_CODE, value);
              ui.partialErrors.baPostalCode = null;
            }
          };

          creditCardInfo.cardType = setDefauldValueOnList(
            creditCardInfo.cardType, creditCardInfo.cardTypes
          );
          creditCardInfo.edExpirationMonth = setDefauldValueOnList(
            creditCardInfo.edExpirationMonth, creditCardInfo.expirationDatesMonth
          );
          creditCardInfo.edExpirationYear = setDefauldValueOnList(
            creditCardInfo.edExpirationYear, creditCardInfo.expirationDatesYear
          );
          creditCardInfo.country = setDefauldValueOnList(
            creditCardInfo.country, creditCardInfo.countries
          );
          creditCardInfo.baStateDisplay = setDefauldValueOnList(
            creditCardInfo.baStateDisplay, creditCardInfo.states
          );
          creditCardInfo.cardCountry = setDefauldValueOnList(
            creditCardInfo.cardCountry, creditCardInfo.cardIssuingCountries
          );
          creditCardInfo.cardCurrency = setDefauldValueOnList(
            creditCardInfo.cardCurrency, creditCardInfo.cardCurrencies
          );

          creditCardInfo.isDocumentNumberVisible = hostScrapService.isVisibleRootDoument();
          creditCardInfo.isDocumentIdVisible = hostScrapService.isVisibleRootDocumentId();
          creditCardInfo.isInstallmentsVisible = hostScrapService.isVisibleRootInstallments();

          // activate card payment by defauld
          hostScrapService.togglePaymentCreditCardPos();

          return creditCardInfo;
        }

        function setDefauldValueOnList(value, collection) {
          if (value !== '') {
            collection.forEach(function (item) {
              if (item.value === value) {
                return item;
              }
            });
          } else {
            return collection[0];
          }
        }

        function buildBankTransferInfo() {
          var inputsType = hostScrapService.getBankTransferInputsSelectorsType();
          var bankTransInfo = {
            baAddressLine1:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_ADDRESS_1),
            baAddressLine2:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_ADDRESS_2),
            baCity:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_CITY),
            baCountry:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_COUNTRY),
            baStateDisplay:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_STATE),
            baPostalCode:
            hostScrapService.getBankTransferValueByInput(inputsType.BA_POSTAL_CODE),

            // lists
            countries: hostScrapService.getBankTransferSelectOptionsByInput(inputsType.BA_COUNTRY),
            states: hostScrapService.getBankTransferSelectOptionsByInput(inputsType.BA_STATE),

            // setters
            setBaAddressLine1: function (value) {
              hostScrapService.setBankTransferValueByInput(inputsType.BA_ADDRESS_1, value);
            },
            setBaAddressLine2: function (value) {
              hostScrapService.setBankTransferValueByInput(inputsType.BA_ADDRESS_2, value);
            },
            setBaCity: function (value) {
              hostScrapService.setBankTransferValueByInput(inputsType.BA_CITY, value);
            },
            setBaCountry: function (value) {
              var self = this;
              hostScrapService.setBankTransferValueByInput(inputsType.BA_COUNTRY, value);
              $timeout(function () {
                self.states =
                  hostScrapService.getBankTransferSelectOptionsByInput(inputsType.BA_STATE);
              }, 2);
            },
            setBaStateDisplay: function (value) {
              hostScrapService.setBankTransferValueByInput(inputsType.BA_STATE, value);
            },
            setBaPostalCode: function (value) {
              hostScrapService.setBankTransferValueByInput(inputsType.BA_POSTAL_CODE, value);
            }
          };

          bankTransInfo.baCountry = setDefauldValueOnList(
            bankTransInfo.baCountry, bankTransInfo.countries
          );
          bankTransInfo.baStateDisplay = setDefauldValueOnList(
            bankTransInfo.baStateDisplay, bankTransInfo.states
          );

          return bankTransInfo;
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
         * @param  {[type]} errors [description]
         * @return {[type]}        [description]
         */
        function validationHelper(errors) {
          var validationErrors = errors.validationErrors;
          ui.errors = [];

          if (!validationErrors && errors.errors) {
            validationErrors = errors.errors;
          }

          if (!validationErrors && errors.length > 0) {
            validationErrors = [];
            $.each(errors, function () {
              validationErrors.push({
                messages: [
                  this.message
                ]
              });
            });
          }
          $scope.ui.messages = [];
          $.each(validationErrors, function (/*value, index*/) {
            var message = this;
            if (message.property) {
              // validate an specific input
              // TODO: Implement this feature
              addMessageToInput(message.property, message.messages[0]);
            } else if (message.key) {
              // add the message to the general messages
              $scope.ui.messages.push(
                {
                  type: 'error',
                  content: message.message
                }
              );
            } else {
              // add the message to the general messages
              $scope.ui.messages.push(
                {
                  type: 'error',
                  content: message.messages[0]
                }
              );
            }
          });
          $scope.$apply();
        }


        function addMessageToInput(propertyName, message) {
          // propertyName = formOfPayment(CREDITCARD_POS).number;
          var inputType =
            hostScrapService.getTypeByFieldAttrName(propertyName);
          var selectorsTypes =
            hostScrapService.getCreditCardInputsSelectorsType();

          if (inputType === selectorsTypes.CARD_TYPE) {
            ui.partialErrors.cardType = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARD_ISSUING_COUNTRY_SELECT) {
            ui.partialErrors.cardCountry = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARD_CURRENCY_SELECT) {
            ui.partialErrors.cardCurrency = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARDHOLDER_NAME) {
            ui.partialErrors.cardHolderName = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARD_NUMBER) {
            ui.partialErrors.cardNumber = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARD_NUMBER_INPUT) {
            ui.partialErrors.cardNumber = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.ED_EXPIRATION_MONTH) {
            ui.partialErrors.edExpirationMonth = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.ED_EXPIRATION_YEAR) {
            ui.partialErrors.edExpirationYear = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.SECURITY_CODE) {
            ui.partialErrors.securityCode = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.SECURITY_CODE_INPUT) {
            ui.partialErrors.securityCode = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.CARDHOLDER_PHONE_CC) {
            ui.partialErrors.cardHolderPhoneCode = message;
          } else if (inputType === selectorsTypes.CARDHOLDER_PHONE_NUMBER) {
            ui.partialErrors.cardHolderPhoneNumber = message;
          } else if (inputType === selectorsTypes.CARDHOLDER_EMAIL) {
            ui.partialErrors.cardHolderEmail = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_ADDRESS_LINE_1) {
            ui.partialErrors.baAddressLine1 = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_ADDRESS_LINE_2) {
            ui.partialErrors.baAddressLine2 = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_CITY) {
            ui.partialErrors.baCity = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_COUNTRY) {
            ui.partialErrors.baCountry = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_STATE_DISPLAY) {
            ui.partialErrors.baStateDisplay = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.BA_POSTAL_CODE) {
            ui.partialErrors.baPostalCode = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === 'TERMS_CONDITIONS') {
            ui.partialErrors.termsConditions = message;
          } else if (inputType === 'HAZARDOUS_MATERIALS') {
            ui.partialErrors.hazardousMaterials = message;
          } else if (propertyName === 'formOfPaymentProperty') {
            ui.partialErrors.notActivePaymentMethod = hostScrapService.checkCopaError(propertyName, message);
          } else if (propertyName === selectorsTypes.INSTALLMENTS) {
            ui.partialErrors.installments = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.DOCUMENT_NUMBER) {
            ui.partialErrors.documentNumber = hostScrapService.checkCopaError(propertyName, message);
          } else if (inputType === selectorsTypes.DOCUMENT_ID) {
            ui.partialErrors.documentId = hostScrapService.checkCopaError(propertyName, message);
          }

          // formOfPaymentProperty
          // formOfPayment(CREDITCARD_POS).number
        }

        function buildAgreements() {
          return {
            termsConditions:
            hostScrapService.getAgreementsValueByInput('TERMS_CONDITIONS'),
            hazardousMaterials:
            hostScrapService.getAgreementsValueByInput('HAZARDOUS_MATERIALS'),
            saveCreditCard:
            hostScrapService.getAgreementsValueByInput('CREDIT_CARD'),
            checkBoxCreditCardStatus: function () {
              var value = hostScrapService.getAgreementsValueByInput('CREDIT_CARD');
              return value;

            },
            checkedSaveCreditCard: function () {
              hostScrapService.checkedSaveCreditCard()
              //ui.partialErrors.termsConditions = null;
            },
            acceptTermsAndConditions: function () {
              hostScrapService.acceptTermsAndConditions();
              ui.partialErrors.termsConditions = null;
            },
            acceptHazardousMaterials: function () {
              hostScrapService.acceptHazardousMaterials();
              ui.partialErrors.hazardousMaterials = null;
            }
          };
        }

        function getBaseFare(model) {
          var totalPriceModel = model.total_price;
          var discountsModel = model.discounts;
          var baseFare = 0;
          baseFare = totalPriceModel.cash - totalPriceModel.taxes - totalPriceModel.fuel_surcharges;
          $.each(discountsModel, function (index, item) {
            baseFare += item.price;
          })
          return baseFare;
        }

        // - visual helpers

        //-------------------------------------------------------
        // listeners
        //-------------------------------------------------------
        instance.init();
        return instance;
      }

      PaymentController.$inject = [
        '$scope',
        'hostUIService',
        'hostScrapService',
        'hostProxyService',
        '$timeout',
        'appHostProxyService',
        '$translate',
        '$sce'
      ];
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
        .controller('PaymentController', PaymentController);
    })({});

    return wrapperInstance;
  });
