/* eslint-disable max-len */
'use strict'

define([
  'jquery',
  'angular',
  'lodash',
  '../services/hostUIService',
  '../services/hostScrapService',
  '../services/hostProxyService',
  '../../../../scripts/filters/strDuration',
  '../../../../scripts/services/hostProxyService',
  '../../../../scripts/filters/range',
  '../../../../scripts/directives/bs-card-ref-id',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card',
  '../../../../scripts/directives/bs-itinerary-pricing-card/bs-itinerary-pricing-card-per-passenger',
  'statsService',
   '../../../../scripts/services/hostUIService'
], function($, angular, _, hostUIService, hostScrapService, hostProxyService,
  strDuration, appHostProxyService, range, bsCardRefId, bsItineraryPricingCard,
  bsItineraryPricingCardPerPassenger, statsService, ApphostUIService) {
  let wrapperInstance = {}

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
     * @param {Object} $filter
     * @param {Object} $sce
     *
     * @return {Object}
     */
    function PassengerInformationController($scope, hostUIService,
      hostScrapService, hostProxyService, $timeout, appHostProxyService,
      $translate, $filter, $sce,ApphostUIService) {
      let instance = this
      let monthsList = []

      // allow to farenet bring back the prices html nodes to
      Farenet2.verbose = 1
      // populate the model with the Farenet values
      let model = Farenet2.parse()

      // view model
      let ui = {
        passengers: getPassengers(),
        total_price: model.total_price,
        discounts: model.discounts,
        messages: [],
        infoMessages: _.chain(hostScrapService.getInfoMessages())
          .map(function(msg) {
            if(msg && msg.isHtml) {
              msg.body = $sce.trustAsHtml(msg.body)
              return msg
            }
            return msg
          })
          .value(),
        errors: [],
        showContinueButton: 1,
        months: monthsList,
        contactInfo: getContactInformation(),
        isInactive: hostScrapService.isInactive(),
      }

      ui.total_price.base_fare = getBaseFare(model)

      $translate(['LABEL_MONTH_JANUARY', 'LABEL_MONTH_FEBRUARY',
        'LABEL_MONTH_MARCH', 'LABEL_MONTH_APRIL', 'LABEL_MONTH_MAY',
        'LABEL_MONTH_JUNE', 'LABEL_MONTH_JULY', 'LABEL_MONTH_AUGUST',
        'LABEL_MONTH_SEPTEMBRE', 'LABEL_MONTH_OCTOBER', 'LABEL_MONTH_NOVEMBER',
        'LABEL_MONTH_DECEMBER']).then(function(translations) {
          monthsList = [
            {name: translations.LABEL_MONTH_JANUARY, days: 31, no: 1},
            {name: translations.LABEL_MONTH_FEBRUARY, days: 28, no: 2},
            {name: translations.LABEL_MONTH_MARCH, days: 31, no: 3},
            {name: translations.LABEL_MONTH_APRIL, days: 30, no: 4},
            {name: translations.LABEL_MONTH_MAY, days: 31, no: 5},
            {name: translations.LABEL_MONTH_JUNE, days: 30, no: 6},
            {name: translations.LABEL_MONTH_JULY, days: 31, no: 7},
            {name: translations.LABEL_MONTH_AUGUST, days: 31, no: 8},
            {name: translations.LABEL_MONTH_SEPTEMBRE, days: 30, no: 9},
            {name: translations.LABEL_MONTH_OCTOBER, days: 31, no: 10},
            {name: translations.LABEL_MONTH_NOVEMBER, days: 30, no: 11},
            {name: translations.LABEL_MONTH_DECEMBER, days: 31, no: 12},
          ]

          ui.months = monthsList
          ui.passengers = ui.passengers.map(function(passenger, index) {
            let no = parseInt(passenger.birthMonth.no)

            if(!isNaN(no)) {
              passenger.birthMonth.name = ui.months[no - 1].name
              passenger.birthMonth.days = ui.months[no - 1].days
            }

            if(passenger.birthDay === '') {
              passenger.birthDay = 1
            }

            if (passenger.birthYear === '') {
              passenger.birthYear = 1990
            }

            $scope.$watch('ui.passengers[' + index + '].birthYear',
            function(newBirthYear) {
              let daysAmount = passenger.birthMonth.days || 31
              if(isLeapYear(newBirthYear) && passenger.birthMonth.no === 2) {
                daysAmount += 1
              }
              passenger.days = $filter('range')([], 1, daysAmount)
            })

            $scope.$watch('ui.passengers[' + index + '].birthMonth',
            function(newBirthMonth) {
              let daysAmount = newBirthMonth.days || 31
              let monthNumber = passenger.birthMonth.no

              if(isLeapYear(passenger.birthYear) && monthNumber === 2) {
                daysAmount += 1
              }

              passenger.days = $filter('range')([], 1, daysAmount)
            })

            return passenger
          })
        })

      // -------------------------------------------------------
      // starting code
      // -------------------------------------------------------

      instance.init = function() {
        console.log('PassengerInformationController init')
      }

      // -------------------------------------------------------
      // binding properties
      // -------------------------------------------------------

      $scope.$parent.showMiniSummary = true
      $scope.$parent.stepper.goToStep(3)

      $scope.ui = ui

      // app manipulation vars
      $scope.$parent.showLoading = false

      // sync the ui height to garanty footer correct positioning
      appHostProxyService.syncHeight($timeout)

      statsService.ruleShowed(Farenet2.getResult(), wrapperInstance.actionConfig)


      // -------------------------------------------------------
      // binding functions
      // -------------------------------------------------------

      $scope.continueButtonAction = function() {
        let formActionNodeSelector = hostProxyService.getFormActionNodeSelector()
        $scope.$parent.showLoading = true
        hostProxyService.clickToCheckedBox();
        appHostProxyService
          .submitFormAction(
            formActionNodeSelector, 'passengerInformation', function(error, value) {
              validationHelper(value.errors)
              $timeout(function() {
                $scope.$parent.showLoading = false
              }, 0)
            })
      }

      // -------------------------------------------------------
      // Helpers
      // -------------------------------------------------------

      // - model helpers
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

      /**
       * @return {Object[]}
       */
      function getPassengers() {
        let $infoBlocks = hostScrapService.getAllInfoBlocks()
        let passengers = []
        let years = $filter('range')([], 1920, (new Date()).getFullYear())

        /**
         * Creates a debounced function that delays invoking func until after
         * wait milliseconds have elapsed since the last time the debounced
         * function was invoked
         *
         * @param {Integer} index
         * @param {Mixed} value
         */
        let setPassengerAgeDb = _.debounce(function(index, value) {
          value = parseInt(value, 10)
          if (!isNaN(value) && (value >= 2 && value <= 11)) {
            hostScrapService.setPassengerAge(index, value)
          } else {
            let self = this // eslint-disable-line
            $timeout(function() {
              self.age = 2
              hostScrapService.setPassengerAge(index, self.age)
            }, 0)
          }
        }, 1000)

        $infoBlocks.each(function(index) {
          let passenger = {
            needSFI: hostScrapService.needSecureFlightInformation(index),
            type: hostScrapService.getPassengerType(index),
            title: hostScrapService.getPassengerTitle(index),
            firstName: hostScrapService.getPassengerFirstName(index),
            lastName: hostScrapService.getPassengerLastName(index),
            gender: hostScrapService.getPassengerCheckedGender(index),
            genderExist: hostScrapService.genderExist(index),
            freqFlyer: hostScrapService.getPassengerFreqFlyer(index),
            memberShip: hostScrapService.getPassengerMemberShip(index),
            suffix: hostScrapService.getPassengerSuffix(index),
            showBirthDate: hostScrapService.showBirthDate(index),
            dobExist: hostScrapService.dobExist(index),
            birthMonth: hostScrapService.getPassengerBirthMonth(index),
            birthDay: hostScrapService.getPassengerBirthDay(index),
            birthYear: hostScrapService.getPassengerBirthYear(index),
            age: hostScrapService.getPassengerAge(index),
            infoArea: hostScrapService.getPassengerInfoArea(index),
            redressNumber: hostScrapService.getPassengerRedressNumber(index),
            redressNumberExist: hostScrapService.redressNumberExist(index),
            years: years.sort(
              function(a, b) {
                return b - a
              }
            ),
            days: [],
            autoFillSelectedOption: hostScrapService.getAutoFillSelectedOption(index),
            autoFillOptions: function() {
              let list =
                hostScrapService.getAllPassengerAutoFillOptions(index)
              let self = this
              if(list.length !== 0) {
                if (this.autoFillSelectedOption === '') {
                  this.autoFillSelectedOption = list[0]
                } else {
                  list.forEach(function(t) {
                    if(self.autoFillSelectedOption === t.value) {
                      self.autoFillSelectedOption = t
                    }
                  })
                }
              }
              return list
            },

            // Get options list
            freqFlyerOptions: function() {
              let list =
                hostScrapService.getAllPassengerFreqFlyerOptions(index)
              let self = this
              if(list.length !== 0) {
                if (this.freqFlyer === '') {
                  this.freqFlyer = list[0]
                } else {
                  list.forEach(function(t) {
                    if(self.freqFlyer === t.value) {
                      self.freqFlyer = t
                    }
                  })
                }
              }

              return list
            },
            titleOptions: function() {
              let list =
                hostScrapService.getAllPassengerTitleOptions(index)
              let self = this
              if(list.length !== 0) {
                if(this.title === '') {
                  this.title = list[0]
                } else {
                  list.forEach(function(t) {
                    if(self.title === t.value) {
                      self.title = t
                    }
                  })
                }
              }
              return list
            },
            // setters
            setTitle: function(value) {
              hostScrapService.setPassengerTitle(index, value.value)
            },
            setFirstName: function(value) {
              hostScrapService.setPassengerFirstName(index, value)
            },
            setGender: function(value) {
              hostScrapService.setPassengerGender(index, value === 'M' ? 1 : 0)
            },
            setlastName: function(value) {
              hostScrapService.setPassengerLastName(index, value)
            },
            setAge: function(value) {
              setPassengerAgeDb.apply(this, [index, value])
            },
            setBirthYear: function(value) {
              hostScrapService.setPassengerBirthYear(index, value)
            },
            setBirthDay: function(value) {
              hostScrapService.setPassengerBirthDay(index, value)
            },
            setBirthMonth: function(value) {
              hostScrapService.setPassengerBirthMonth(index, value)
            },
            setRedressNumber: function(value) {
              hostScrapService.setPassengerRedressNumber(index, value)
            },
            setSuffix: function(value) {
              hostScrapService.setPassengerSuffix(index, value)
            },
            setFreqFlyer: function(value) {
              hostScrapService.setPassengerFreqFlyer(index, value)
            },
            setAutoFillOption: function(value) {
              hostScrapService.setAutoFillSelectedOption(index, value)
              syncPassenger($scope.ui.passengers[index], index)
            },
            setMemberShip: function(value) {
              hostScrapService.setPassengerMemberShip(index, value)
            },
            argTaxId: {
              exist: hostScrapService.existArgentinaTaxID(index),
              taxIdCodeOptions: function() {
                let list =
                  hostScrapService.getAllPassengerTaxIDCodeOptions(index)
                let self = this
                if(list.length !== 0) {
                  if(this.taxIdCode === '') {
                    this.taxIdCode = list[0]
                  } else {
                    list.forEach(function(t) {
                      if(self.taxIdCode === t.value) {
                        self.taxIdCode = t
                      }
                    })
                  }
                }
                return list
              },
              taxIdCodeLabel: hostScrapService.getPassengerTaxIDCodeLabel(index),
              taxIdCode: hostScrapService.getPassengerTaxIDCode(index),
              setTaxIdCode: function(tc) {
                return hostScrapService.setPassengerTaxIDCode(index, tc.value)
              },
              taxIdNumber: hostScrapService.getPassengerTaxIDNumber(index),
              setTaxIdNumber: function(tn) {
                return hostScrapService.setPassengerTaxIDNumber(index, tn)
              },
              taxIdNumberLabel: hostScrapService.getPassengerTaxIDNumberLabel(index),
              taxIdCountryLabel: hostScrapService.getPassengerTaxIDCountryLabel(index),
              taxIdCountry: hostScrapService.getPassengerTaxIDCountry(index),
              setTaxIdCountry: function(tc) {
                return hostScrapService.setPassengerTaxIDCountry(index, tc.value)
              },
              taxIdCountryOptions: function() {
                let list =
                  hostScrapService.getAllPassengerTaxIDCountryOptions(index)
                let self = this
                if(list.length !== 0) {
                  if(this.taxIdCountry === '') {
                    this.taxIdCountry = list[0]
                  } else {
                    list.forEach(function(t) {
                      if(self.taxIdCountry === t.value) {
                        self.taxIdCountry = t
                      }
                    })
                  }
                }
                return list
              },
            },
          }
          passenger.birthDay = parseInt(passenger.birthDay)
          passenger.birthYear = parseInt(passenger.birthYear)
          passengers.push(passenger)
          // passenger.setBirthMonth(1);
        })

        return passengers
      }

      /**
       * @return {Object}
       */
      function getContactInformation() {
        let contactInfo = {
          email: hostScrapService.getContactInformationEmail(),
          confirmEmail: hostScrapService.getContactInformationConfirmEmail(),
          telCode: hostScrapService.getContactInformationHomeTelCode(),
          telNumber: hostScrapService.getContactInformationHomeTelNumber(),
          mobileCode: hostScrapService.getContactInformationMobileCode(),
          mobilePhone: hostScrapService.getContactInformationMobileNumber(),
          setEmail: hostScrapService.setContactInformationEmail,
          setConfirmEmail: hostScrapService.setContactInformationConfirmEmail,
          setTelCode: hostScrapService.setContactInformationHomeTelCode,
          setTelNumber: hostScrapService.setContactInformationHomeTelNumber,
          setMobileCode: hostScrapService.setContactInformationMobileCode,
          setMobilePhone: hostScrapService.setContactInformationMobileNumber,
        }

        return contactInfo
      }
      /**
       * @param {Object} passenger
       * @param {int} index
       */
      function syncPassenger(passenger, index) {
        passenger.title = hostScrapService.getPassengerTitle(index)
        passenger.firstName = hostScrapService.getPassengerFirstName(index)
        passenger.lastName = hostScrapService.getPassengerLastName(index)
        passenger.freqFlyer = hostScrapService.getPassengerFreqFlyer(index)
        passenger.memberShip = hostScrapService.getPassengerMemberShip(index)
        passenger.suffix = hostScrapService.getPassengerSuffix(index)
        passenger.birthMonth = hostScrapService.getPassengerBirthMonth(index)
        passenger.birthDay = hostScrapService.getPassengerBirthDay(index)
        passenger.birthYear = hostScrapService.getPassengerBirthYear(index)
        passenger.age = hostScrapService.getPassengerAge(index)
        passenger.infoArea = hostScrapService.getPassengerInfoArea(index)
        passenger.redressNumber = hostScrapService.getPassengerRedressNumber(index)
        passenger.birthDay = parseInt(passenger.birthDay)
        passenger.birthYear = parseInt(passenger.birthYear)

        passenger.gender = hostScrapService.getPassengerCheckedGender(index)
        if(!passenger.gender) {
          passenger.gender = 'M'
          hostScrapService.setPassengerGender(index, 1)
        }
      }

      /**
       * @param {String | int} year
       * @return {Boolean}
       */
      function isLeapYear(year) {
        let y = parseInt(year)
        return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)
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
       *
       */
      function validationHelper(errors) {
        let validationErrors = errors.validationErrors || []
        ui.errors = []     
        ApphostUIService.scrollToTop();        
        if(!validationErrors.length && errors.length > 0) {              
          validationErrors = []
          $.each(errors, function() {
            validationErrors.push({
              messages: [
                this.message, // eslint-disable-line
              ],
            })
          })
        }
        $.each(validationErrors, function(/* value, index*/) {
          let message = this // eslint-disable-line
          if(message.property) {
            // validate an specific input
            // TODO: Implement this feature
            addMessageToInput(message.property, message.messages[0])
          } else {
            // add the message to the general messages
            $scope.ui.messages = []
            $scope.ui.messages.push(
              {
                type: 'error',
                content: message.messages[0],
              }
            )
          }
        })
        $scope.$apply()
      }
      /**
       * @param {String} propertyName
       * @param {String} message
       */
      function addMessageToInput(propertyName, message) {
        // propertyName = 'travellersInfo[0].firstName';
        // message = 'First name is required';
        let indexRegExp = /\[([^)]+)\]/
        let propertyRegExp = /\]\.(.*)/
        let indexMatches = indexRegExp.exec(propertyName)
        let propertyMatches = propertyRegExp.exec(propertyName)
        let index
        let property

        if(indexMatches && indexMatches.length > 0) {
          index = parseInt(indexMatches[1])
        }

        if(propertyMatches && propertyMatches.length > 0) {
          property = propertyMatches[1]
        }

        if(typeof index != 'undefined' && typeof property != 'undefined') {
          if(!ui.errors[index]) {
            ui.errors[index] = {}
          }
          ui.errors[index][property] = message
        } else {
          // common properties
          ui.errors[21] = {}
          ui.errors[21][propertyName] = message
        }
      }


      // - visual helpers

      // -------------------------------------------------------
      // listeners
      // -------------------------------------------------------
      instance.init()
      return instance
    }

    PassengerInformationController.$inject = [
      '$scope',
      'hostUIService',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$translate',
      '$filter',
      '$sce',
      'ApphostUIService'
    ]
    angular
        .module('responsiveBookingEngine')
        .filter('duration', strDuration)
        .filter('range', range)
        .directive('bsCardRefId', bsCardRefId)
        .directive('bsItineraryPricingCard', bsItineraryPricingCard)
        .directive('bsItineraryPricingCardPerPassenger', bsItineraryPricingCardPerPassenger)
        .controller('PassengerInformationController', PassengerInformationController)
  })({})

  return wrapperInstance
})
