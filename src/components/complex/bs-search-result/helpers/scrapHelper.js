define([
  'jquery',
  './hostUIService',
  './hostProxyService',
], ($jq, hostUIService, hostProxyService) => {
  'use strict'
  $jq = ($ !== undefined) ? $ : $jq
  hostUIService = hostUIService()
  /**
   * @return {Object}
   */
  function getUI() {
    let ui = {
      departureDialogIsOpen: false,
      returnDialogIsOpen: false,
      messages: [],
      errors: {},
      sellingClass: {
        openDialog: false,
        html: '<div></div>',
      },
      flightDetails: {
        openDialog: false,
        data: {},
      },
      showContinueButton: 0,
      // mediaInfoMessages: hostScrapService.getMediaInfoMessages(),
      clickBtnSelectFlightClass: function(isDeparture) {
        if (ui.user_input_journey_type !== 'Multi City') {
          if(isDeparture) {
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
    if(Farenet2) {
      Farenet2.verbose = 1
      let model = Farenet2.getResult()
      ui.model = model
      ui.locations = getLocations(model)
      ui.user_input_journey_type = model.user_input_journey_type
      ui.passengers = model.passengers
    }

    /**
     * Augment the locations ViewModel with
     * the necessary properties for the UI like:
     * (selectedClassIndex, show, summary)
     * @return {Object[]}
     */
    function getLocations() {
      let locations = ui.model.geo.location
          // find available classes and return the fitst
      let selectAvailableFlight = function(availableClasses) {
        for(let i = 0; i < availableClasses.length; i++) {
          if (availableClasses[i].cheapestPrice !== 'N/A') {
            availableClasses[i].selected = true
            return availableClasses[i]
          }
        }
        if(availableClasses.length > 0) {
          availableClasses[0].selected = true
        }
        return availableClasses[0]
      }

      $.each(locations, function(index, value) {
        /* eslint-disable no-invalid-this*/
        this.departure = ui.model.departure[index]
        this.departure.availableClasses =
              getAvailableClasses(this.departure.dates[0].flights)

        this.extra_info = {
          geo: ui.model.extra_info.geo[index],
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

        if(ui.model.return && ui.model.return[index]) {
          this.return = ui.model.return[index]
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

        this.disclaimer_mapping = ui.model.disclaimer_mapping
      })


      return locations
    }
    /**
     * getAvailableClasses
     *
     * @param {Object[]} flights
     * @return {Object[]}
     */
    function getAvailableClasses(flights) {
      let availableClasses = []
      if(flights.length > 0) {
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
         * @param {Object} index
         */
        let updateExistedClass = function(cls, index) {
          let exist = false
          for(let i = 0; i < availableClasses.length; i++) {
            let clsAvailable = availableClasses[i]
            if (cls.name === clsAvailable.name) {
              if (clsAvailable.cheapestPrice === 'N/A' &&
                  cls.price.cash !== -1 && cls.price.cash !== -3) {
                clsAvailable.cheapestPrice = cls.price.cash
                if(cls.price.cash_after_discount) {
                  clsAvailable.cash_after_discount =
                    cls.price.cash_after_discount
                }
              }
              exist = true
              break
            }
          }
          if(!exist) {
            let cheapestPrice = cls.price.cash
            /* eslint-disable camelcase */
            let cash_after_discount = cls.price.cash_after_discount
            if(cheapestPrice === -1) {
              cheapestPrice = 'N/A'
            } else if(cheapestPrice === -3) {
              cheapestPrice = ''
            } else{
              cheapestPrice
            }

              // get all css class from html node
            let definedAttrClass = cls.htmlNode.attr('class')
            let descriptions = []

            if(typeof definedAttrClass !== typeof undefined) {
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
              if(descriptions.length > 0) {
                descriptions = descriptions.map(function(i, li) {
                  return $(li).text()
                })
              } else{
                  // in CMCO the HTML structure is different
                descriptions = $(selector)
                    .find('.simpleToolTip p')
                if(descriptions.length > 0) {
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

            if(cash_after_discount) {
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

                  ui.sellingClass.isLoading = true
                  ui.sellingClass.openDialog = true
                },
              }
            }
          })

          flight.info.flight_list.forEach(function(fInfo) {
            fInfo.numberEvent = function() {
              hostUIService.swapToBSFlightDetailsLoadCallback()
              fInfo.flightNumberHtmlNode[0].click()

                // This hide the dialog and shadow
              setTimeout(function() {
                $('#flightDetailsPopUpOuter').attr('style', 'display:none')
                $('.dialogFooter .button2')[0].click()
                ui.flightDetails.openDialog = true
                ui.flightDetails.isLoading = true
              }, 0)
            }
          })
        })
      }
      console.log($('.colCostSelected'))
      console.log(availableClasses)
      return availableClasses
    }
    return ui
  }

  return {
    getUI: getUI,
  }
})

