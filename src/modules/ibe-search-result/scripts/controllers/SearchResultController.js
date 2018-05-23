/* eslint-disable max-len,no-invalid-this,camelcase */
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
  '../../../../scripts/directives/jqui-dialog',
  '../../../../components/complex/bs-fare-hold/index.component',
  'statsService',
  'lodash',
  '../../../../scripts/services/hostUIService',
], function($, angular, hostUIService, hostScrapService, hostProxyService,
  strDuration, strSimpleDate, sanitize, collUnique, appHostProxyService,
  jquiDialog, bsFareHoldComponent, statsService, _, ApphostUIService) {
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
     *
     * @param {Object} $scope
     * @param {Object} hostUIService
     * @param {Object} hostScrapService
     * @param {Object} hostProxyService
     * @param {Object} $timeout
     * @param {Object} appHostProxyService
     * @param {Object} $filter
     * @param {Object} $sce
     * @param {Object} ApphostUIService
     *
     * @return {Object}
     */
    function SearchResultController(
      $scope,
      hostUIService,
      hostScrapService,
      hostProxyService,
      $timeout,
      appHostProxyService,
      $filter,
      $sce,
      ApphostUIService,
      $interval

    ) {
      let instance = this

      // -------------------------------------------------------
      // starting code
      // -------------------------------------------------------

      instance.init = function() {
        console.log('SearchResultController init')
      }

      // -------------------------------------------------------
      // binding properties
      // -------------------------------------------------------

      // the model that is used to populated the view model
      // the actual values are just for example purposes
      // we are taking the values from the Farenet API
      let model = {
        locations: [{
          user_input_origin_airport_code: 'Miami',
          user_input_destination_airport_code: 'Panama',
        }],
        departure: [{
          user_input_travel_class: 'Economy Promo',
          user_input_date: '2016-03-20',
          dates: [
            {
              date: '2016-03-20',
              lowest_price: 4545,
              selected: 1,
              flights: [{
                info: {
                  departure_time: '20:40',
                  arrival_time: '18:40',
                  duration: 960,
                  flight_list: [
                    'EY 51(Etihad Airways)',
                    'EY 431 (Etihad Airways)',
                  ],
                  classes: [{
                    name: 'Economy Promo',
                    price: {
                      cash: 200,
                      miles: 0,
                    },
                    seat: 3,
                  },
                  {
                    name: 'Economy Deluxe',
                    price: {
                      cash: 300,
                      miles: 0,
                    },
                    seat: 3,
                  }],
                },
              },
              {
                info: {
                  departure_time: '20:40',
                  arrival_time: '18:40',
                  duration: 960,
                  flight_list: [
                    'EY 51(Etihad Airways)',
                    'EY 431 (Etihad Airways)',
                  ],
                  classes: [{
                    name: 'Economy Promo',
                    price: {
                      cash: 200,
                      miles: 0,
                    },
                    seat: 3,
                  },
                  {
                    name: 'Economy Deluxe',
                    price: {
                      cash: 300,
                      miles: 0,
                    },
                    seat: 3,
                  },
                    // n
                  ],
                },
              },
              ],
            }, {
              date: '2016-03-20',
              lowest_price: 4545,
              selected: 0,
              flights: [],
            }],
        }],
        return: [{
          user_input_travel_class: 'Economy Promo',
          user_input_date: '2016-03-20',
          dates: [{
            date: '2016-03-20',
            lowest_price: 4545,
            selected: 1,
            flights: [{
              info: {
                departure_time: '20:40',
                arrival_time: '18:40',
                duration: 960,
                flight_list: [
                  'EY 51(Etihad Airways)',
                  'EY 431 (Etihad Airways)',
                ],
                classes: [{
                  name: 'Economy Promo',
                  price: {
                    cash: 200,
                    miles: 0,
                  },
                  seat: 3,
                },
                {
                  name: 'Economy Deluxe',
                  price: {
                    cash: 300,
                    miles: 0,
                  },
                  seat: 3,
                }],
              },
            },
            {
              info: {
                departure_time: '20:40',
                arrival_time: '18:40',
                duration: 960,
                flight_list: [
                  'EY 51(Etihad Airways)',
                  'EY 431 (Etihad Airways)',
                ],
                classes: [{
                  name: 'Economy Promo',
                  price: {
                    cash: 200,
                    miles: 0,
                  },
                  seat: 3,
                },
                {
                  name: 'Economy Deluxe',
                  price: {
                    cash: 300,
                    miles: 0,
                  },
                  seat: 3,
                }],
              },
            }],
          },
          {
            date: '2016-03-20',
            lowest_price: 4545,
            selected: 0,
            flights: [
            ],
          }],
        }],
        user_input_journey_type: 'Round Trip',
      }

      // allow to Farenet bring back the prices html nodes to
      Farenet2.verbose = 1
      // populate the model with the Farenet values
      model = Farenet2.parse()

      // view model
      let ui = {
        locations: getLocations(),
        user_input_journey_type: model.user_input_journey_type,
        total_price: model.total_price,
        departureDialogIsOpen: false,
        returnDialogIsOpen: false,
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
        showContinueButton: 0,
        fareHoldData: 'undefined',
        mediaInfoMessages: hostScrapService.getMediaInfoMessages(),
        clickBtnSelectFlightClass: function(isDeparture) {
          if (ui.user_input_journey_type !== 'Multi City') {
            if (isDeparture) {
              ui.departureDialogIsOpen = true
            } else {
              ui.returnDialogIsOpen = true
            }
          }
        },
        onSelectFlightClass: function(option, isDeparture, location) {
          let isAvailable = (option.cheapestPrice !== 'N/A')
          if (!isAvailable) {
            return
          }

          location.departure.selectedClassIndex.selected = false
          option.selected = true

          if (isDeparture) {
            location.departure.selectedClassIndex = option
            this.departureDialogIsOpen = false
          } else {
            location.return.selectedClassIndex = option
            this.returnDialogIsOpen = false
          }
        },
      }

      $scope.ui = ui

      // app manipulation vars
      $scope.$parent.showLoading = false

      $scope.$parent.showMiniSummary = true

      $scope.$parent.stepper.goToStep(1)


      syncDefaultErrorMessages()

      setFareHoldData()

      // sync the ui height to garanty footer correct positioning
      appHostProxyService.syncHeight($timeout)

      statsService.ruleShowed(Farenet2.getResult(), wrapperInstance.actionConfig)


      // -------------------------------------------------------
      // binding functions
      // -------------------------------------------------------

      $scope.selectFlightAction = function(flight, location, locationType, index, $event) {
        // TODO: Break this function in small reusable pieces

        let locationBound = location.departure
        if (locationType === 'return') {
          locationBound = location.return
        }

        let selectedClassIndex = locationBound.selectedClassIndex.id
        let infoClass = flight.info.classes[selectedClassIndex]

        if (infoClass) {
          // check the price of flight if it have negative price not change the
          // view
          if (infoClass.price.cash === -1) {
            return
          }

          // click the price trought the host service
          hostProxyService.selectFlightAction(infoClass.htmlNode)

          // populate the location summary
          locationBound.summary.departure_time = flight.info.departure_time
          locationBound.summary.arrival_time = flight.info.arrival_time
          locationBound.summary.duration = flight.info.duration
          locationBound.summary.stops = flight.info.flight_list.length - 1
          locationBound.summary.flight_list = flight.info.flight_list
          locationBound.summary.price = infoClass.price.cash
          locationBound.summary.cash_after_discount = infoClass.price.cash_after_discount

          locationBound.summary.disclaimers = getDisclaimers(flight.info)

          // show the summary interface
          locationBound.summary.show = 1

          // hide the specific location interface
          locationBound.show = 0

          // open the return part ||
          // (open the next location in the case of multicity)
          if (locationType === 'departure') {
            if (location.return && locationBound.selectingValueForFirstTime) {
              location.return.show = 1
            } else {
              // TODO: mark the current as checked
              location.done = 1
              if (ui.locations.length > 1) {
                // TODO: Put this code in a helper
                let areAllSummaryShowed = 1
                for (let i = 0; i < ui.locations.length; i++) {
                  if (!ui.locations[i].departure.summary.show) {
                    areAllSummaryShowed = 0
                    break
                  }
                }
                if (areAllSummaryShowed) {
                  // TODO: If there are not other locations show the continue
                  ui.showContinueButton = 1
                }
              } else {
                ui.showContinueButton = 1
              }
            }
          } else {
            // Show the general sumary and the button
            // See the mokup below
            ui.showContinueButton = 1
            location.done =1

            // https://projects.invisionapp.com/d/main#/console/6681575/147006373/preview#project_console
            // open the next location in case to be in a multicity
            // TODO: Add the code for open the next location here
          }
        }


        if (locationBound.selectingValueForFirstTime) {
          locationBound.selectingValueForFirstTime = 0
        }

        setFareHoldData()
      }

      $scope.closeDepartureLocationSummaryAction = function(location) {
        location.departure.show = 1
        location.departure.summary.show = 0
        location.done = 0
        if (location.return) {
          location.return.show = 0
          if (location.return.summary.show === 0 && !location.departure.selectingValueForFirstTime) {
            location.departure.selectingValueForFirstTime = 1
            location.return.selectingValueForFirstTime = 1
          }
        }

        ui.showContinueButton = 0
      }

      $scope.closeReturnLocationSummaryAction = function(location) {
        location.return.show = 1
        location.return.summary.show = 0
        ui.showContinueButton = 0
        location.done = 0
      }

      $scope.continueButtonAction = function() {
        let formActionNodeSelector = hostProxyService.getFormActionNodeSelector()
        let deferred = appHostProxyService.submitFormAction(formActionNodeSelector)
        $scope.$parent.showLoading = true
        deferred.done(function(value) {
          validationHelper(value.errors)
          $timeout(function() {
            $scope.$parent.showLoading = false
          }, 0)
        })
      }

      // SliderBar Currency
      $scope.main.chooseCurrency = (function() {
        return hostScrapService.getChooseCurrencyOptions()
      })()
      $scope.main.selectedChooseCurrency = (function() {
        let strValue = hostScrapService.getChooseCurrency()
        let value = null
        $scope.main.chooseCurrency.forEach(function(el) {
          if (el.value === strValue) {
            value = el
          }
        })
        if (!value) {
          value = $scope.main.chooseCurrency[0]
        }
        return value
      })()
      $scope.main.onChangeChooseCurrency = function(selected) {
        $scope.$parent.hideMenu()
        $scope.$parent.showLoading = true
        appHostProxyService.mockProcessAirFlightSearchFormValidationErrors()
        // appHostProxyService.mockInvokeBusinessAction();
        appHostProxyService.mockProcessResult()
        hostScrapService.getSetChooseCurrency(selected)
      }
      // -------------------------------------------------------
      // Helpers
      // -------------------------------------------------------

      // - model helpers

      /**
       * Augment the locations ViewModel with
       * the necessary properties for the UI like:
       * (selectedClassIndex, show, summary)
       *
       * @return {Object}
       */
      function getLocations() {
        let locations = model.geo.location
        // find available classes and return the fitst
        let selectAvailableFlight = function(availableClasses) {
          for (let i = 0; i < availableClasses.length; i++) {
            if (availableClasses[i].cheapestPrice !== 'N/A') {
              availableClasses[i].selected = true
              return availableClasses[i]
            }
          }
          if (availableClasses.length > 0) {
            availableClasses[0].selected = true
          }
          return availableClasses[0]
        }

        $.each(locations, function(index, value) {
          this.departure = model.departure[index]
          this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights)

          this.extra_info = {
            geo: model.extra_info.geo[index],
          }

          this.departure.selectedClassIndex =
              selectAvailableFlight(this.departure.availableClasses)

          this.departure.show = 1
          this.departure.done = 0
          this.departure.selectingValueForFirstTime = 1
          this.departure.summary = {
            show: 0,
            departure_time: '',
            arrival_time: '',
            duration: 960,
            stops: 0,
            flight_list: [],
            price: 0,
            disclaimers: [],
          }

          if (model.return && model.return[index]) {
            this.return = model.return[index]
            this.return.show = 0
            this.return.done = 0
            this.return.selectingValueForFirstTime = 1
            this.return.summary = {
              show: 0,
              selectingValueForFirstTime: 1,
              departure_time: '',
              arrival_time: '',
              duration: 300,
              stops: 0,
              flight_list: [],
              price: 0,
              disclaimers: [],
            }

            this.return.availableClasses =
                getAvailableClasses(this.return.dates[0].flights)
            this.return.selectedClassIndex =
                selectAvailableFlight(this.return.availableClasses)
          }

          this.disclaimer_mapping = model.disclaimer_mapping
        })


        return locations
      }
      /**
       * @param {Object} flightInfo
       * @return {Array}
       */
      function getDisclaimers(flightInfo) {
        return _.chain(flightInfo.flight_list)
          .map(function(f) {
            return f.disclaimer
          })
          .flatten()
          .uniqBy('id')
          .sortBy('id')
          .value()
      }
      /**
       *
       * @param {Array} flights
       * @return {Array}
       */
      function getAvailableClasses(flights) {
        let availableClasses = []
        if (flights.length > 0) {
          let cssClasses = [
            'flight-class--level1',
            'flight-class--level2',
            'flight-class--level3',
            'flight-class--level4',
            'flight-class--level5',
          ]
          /**
           * Inner Function
           *
           * @param {Object} cls
           * @param {int} index
           */
          let updateExistedClass = function(cls, index) {
            let exist = false
            for (let i = 0; i < availableClasses.length; i++) {
              let clsAvailable = availableClasses[i]
              if (cls.name === clsAvailable.name) {
                if (clsAvailable.cheapestPrice === 'N/A' &&
                  cls.price.cash !== -1 && cls.price.cash !== -3) {
                  clsAvailable.cheapestPrice = cls.price.cash
                  if (cls.price.cash_after_discount) {
                    clsAvailable.cash_after_discount = cls.price.cash_after_discount
                  }
                }
                exist = true
                break
              }
            }
            if (!exist) {
              let cheapestPrice = cls.price.cash
              let cash_after_discount = cls.price.cash_after_discount
              if (cheapestPrice === -1) {
                cheapestPrice = 'N/A'
              } else if (cheapestPrice === -3) {
                cheapestPrice = ''
              } else {
                cheapestPrice
              }

              // get all css class from html node
              let definedAttrClass = cls.htmlNode.attr('class')
              let descriptions = []

              if (typeof definedAttrClass !== typeof undefined) {
                let strArray = []
                // all CSS classes are selected except colCostNotAvail
                definedAttrClass.split(' ').forEach(function(cssClass) {
                  if ('colCostNotAvail' !== cssClass &&
                    '' !== cssClass && 'colCostSelected' !== cssClass) {
                    strArray.push(cssClass)
                  }
                })
                // Get the three first class as array and append thead and
                // seudo-selector :first
                let selector = 'thead .' + strArray.join('.') + ' :first'
                // get the tooltip contain
                descriptions = $(selector)
                  .find('.simpleToolTip ul li')
                if (descriptions.length > 0) {
                  descriptions = descriptions.map(function(i, li) {
                    return $(li).text()
                  })
                } else {
                  // in CMCO the HTML structure is different
                  descriptions = $(selector)
                    .find('.simpleToolTip p')
                  if (descriptions.length > 0) {
                    descriptions = $(descriptions[0]).html().split('<br>')
                    descriptions = descriptions
                      .map(function(i, chunk) {
                        i = i.replace('• ', '')
                        return i
                      })
                  }
                }
              }

              let classObject = {
                name: cls.name,
                cheapestPrice: cheapestPrice,
                id: index,
                cssClass: cssClasses[index],
                desc: descriptions,
              }

              if (cash_after_discount) {
                classObject.cash_after_discount = cash_after_discount
              }

              availableClasses.push(classObject)
            }
          }

          flights.forEach(function(flight) {
            flight.info.classes.forEach(function(cls, index) {
              updateExistedClass(cls, index)

              // Selling Class
              let sellingClassLink =
                cls.htmlNode.find('.colPrice .sellingClass a')
              if (sellingClassLink.length > 0) {
                cls.sellingClass = {
                  text: sellingClassLink.text(),
                  click: function($event) {
                    $event.stopPropagation()
                    hostUIService.swapToBSFillFareRuleTabCallback()
                    sellingClassLink[0].click()
                    $('#airFareRulesPopUpOuter').attr('style', 'display:none')
                    $('#popupShimOuter').attr('style', 'display:none')

                    $scope.ui.sellingClass.isLoading = true
                    $scope.ui.sellingClass.openDialog = true
                  },
                }
              }
            })

            flight.info.flight_list.forEach(function(fInfo) {
              fInfo.numberEvent = function() {
                hostUIService.swapToBSFlightDetailsLoadCallback()
                fInfo.flightNumberHtmlNode[0].click()

                // This hide the dialog and shadow
                $timeout(function() {
                  $('#flightDetailsPopUpOuter').attr('style', 'display:none')
                  $('.dialogFooter .button2')[0].click()
                  $scope.ui.flightDetails.openDialog = true
                  $scope.ui.flightDetails.isLoading = true
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
      /**
       * syncDefaultErrorMessages
       */
      function syncDefaultErrorMessages() {
        let deferred = hostScrapService.getDefaultErrorMessages()
        deferred.done(function(value) {
          $timeout(function() {
            $scope.ui.messages = value
          }, 0)
        })
      }

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
       */
      function validationHelper(errors) {
        let validationErrors = errors.validationErrors
        ApphostUIService.scrollToTop()
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
        $.each(validationErrors, function(/* value, index*/) {
          let message = this
          if (message.property) {
            // validate an specific input
            // TODO: Implement this feature
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

      function setFareHoldData(){
        var promise = $interval(()=>{
          if(hostScrapService.existFareHold() == true){
            console.log("iteracion")
            $timeout(()=>{
              $scope.ui.fareHoldData = {
                textDescription: hostScrapService.getDescriptionImg() || '',
                linkDescription: hostScrapService.getDescriptionNote() || '',
                priceOptions: hostScrapService.getFareHoldOffers() || [],
                bannerImg: hostScrapService.getBannerImg() || '#',
                existFareHold: hostScrapService.existFareHold() || false
              } 
            },0)            
            $interval.cancel(promise)
          }
        },500)
      }

      // - visual helpers

      // -------------------------------------------------------
      // listeners
      // -------------------------------------------------------
      instance.init()
      return instance
    }

    SearchResultController.$inject = [
      '$scope',
      'hostUIService',
      'hostScrapService',
      'hostProxyService',
      '$timeout',
      'appHostProxyService',
      '$filter',
      '$sce',
      'ApphostUIService',
      '$interval'
    ]

    angular
      .module('responsiveBookingEngine')
      .factory('hostUIService', hostUIService)
      .filter('duration', strDuration)
      .filter('simpledate', strSimpleDate)
      .filter('sanitize', sanitize)
      .filter('unique', collUnique)
      .directive('jquiDialog', jquiDialog)
      .component('bsFareHoldComponent', bsFareHoldComponent)
      .controller('SearchResultController', SearchResultController)
  })({})

  return wrapperInstance
})
