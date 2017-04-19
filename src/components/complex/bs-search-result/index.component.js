define([
  'jquery',
  './helpers/scrapHelper',
  './helpers/hostUIService',
  './helpers/hostProxyService',
  '../../../scripts/directives/jqui-dialog',
  '../../../scripts/filters/strDuration',
  '../../../scripts/filters/strSimpleDate',
  '../../../scripts/filters/sanitize',
  '../../../scripts/filters/collUnique',
  'lodash',
], ($, helperDefault, hostUIService, hostProxyService,
  jquiDialog, strDuration, strSimpleDate, sanitize,
  collUnique, _) => {
  'use strict'
  /**
   * Seats Selection Legend Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$timeout]
   * @param {Object} [$sce]
   */
  function SearchResultController($scope, $timeout, $sce) {
    let ctrl = this
    // let hostUIService = hostUIService()
    ctrl.helper = helperDefault
    ctrl.hostProxyService = hostProxyService
    ctrl.ui = {}
    /**
     * Init component
     */
    ctrl.$onInit = function() {
      ctrl.renderUI()
      ctrl.bindUI()
      ctrl.syncUI()
    }

    ctrl.renderUI = function() {
    }

    ctrl.bindUI = function() {
      $scope.$on('app:language-changed', function(event, data) {
        ctrl.scrapHost()
      })
    }

    ctrl.syncUI = function() {
      ctrl.scrapHost()
    }

    ctrl.scrapHost = function() {
      $timeout(function() {
        ctrl.ui = ctrl.helper.getUI()
        ctrl.ui.sellingClass = {
          openDialog: false,
          html: $sce.trustAsHtml('<div> </div>'),
        }

        ctrl.ui.flightDetails = {
          openDialog: false,
          data: {},
        }

        if(typeof hostUIService === 'function') {
          hostUIService = hostUIService()
        }

        hostUIService.setHandlerSellingClass(function(error, response) {
          if(error) {
            console.log('[error] Loading Selling Class Info')
          }

          $timeout(function() {
            ctrl.ui.sellingClass.html = $sce.trustAsHtml(response)
            ctrl.ui.sellingClass.isLoading = false
          }, 0)

          hostUIService.swapToOrgFillFareRuleTabCallback()

          let closeDialog = $('#airFareRulesPopUpOuter .dialogClose a')
          if(closeDialog.length > 0) {
            closeDialog[0].click()
          }
        })
        hostUIService.setHandlerFlightDetails(function(error, success) {
          if(error) {
            console.log('[error]', error)
            return
          }

          hostUIService.swapToOrgFlightDetailsCallbacks()

          $timeout(function() {
            ctrl.ui.flightDetails.isLoading = false
            ctrl.ui.flightDetails.data = success
          }, 0)
        })

        ctrl.selectFlightAction = function(
          flight, location, locationType, index, $event) {
          // TODO: Break this function in small reusable pieces

          let locationBound = location.departure
          if(locationType === 'return') {
            locationBound = location.return
          }

          let selectedClassIndex = locationBound.selectedClassIndex.id
          let infoClass = flight.info.classes[selectedClassIndex]

          if (infoClass) {
            // check the price of flight if it have negative price
            // not change the view
            if (infoClass.price.cash === -1) {
              return
            }

            // click the price trought the host service

            hostProxyService = ctrl.hostProxyService.getHostProxyService()
            console.log(hostProxyService)
            hostProxyService.selectFlightAction(infoClass.htmlNode)

            // populate the location summary
            locationBound.summary.departure_time = flight.info.departure_time
            locationBound.summary.arrival_time = flight.info.arrival_time
            locationBound.summary.duration = flight.info.duration
            locationBound.summary.stops = flight.info.flight_list.length - 1
            locationBound.summary.flight_list = flight.info.flight_list
            locationBound.summary.price = infoClass.price.cash
            locationBound.summary.cash_after_discount =
              infoClass.price.cash_after_discount

            locationBound.summary.disclaimers = getDisclaimers(flight.info)

            // show the summary interface
            locationBound.summary.show = 1

            // hide the specific location interface
            locationBound.show = 0

            // open the return part ||
            // (open the next location in the case of multicity)
            if(locationType === 'departure') {
              if(location.return && locationBound.selectingValueForFirstTime) {
                location.return.show = 1
              } else{
                // TODO: mark the current as checked
                location.done = 1
                if(ctrl.ui.locations.length > 1) {
                  // TODO: Put this code in a helper
                  let areAllSummaryShowed = 1
                  for (let i = 0; i < ctrl.ui.locations.length; i++) {
                    if(!ctrl.ui.locations[i].departure.summary.show) {
                      areAllSummaryShowed = 0
                      break
                    }
                  }
                  if(areAllSummaryShowed) {
                    // TODO: If there are not other locations show the continue
                    ctrl.ui.showContinueButton = 1
                  }
                } else {
                  ctrl.ui.showContinueButton = 1
                }
              }
            } else {
              // Show the general sumary and the button
              // See the mokup below
              ctrl.ui.showContinueButton = 1
              location.done =1

              // https://projects.invisionapp.com/d/main#/console/6681575/147006373/preview#project_console
              // open the next location in case to be in a multicity
              // TODO: Add the code for open the next location here
            }
          }
          if(locationBound.selectingValueForFirstTime) {
            locationBound.selectingValueForFirstTime = 0
          }
        }

        /**
         *
         * @param {Object[]} flightInfo
         * @return {Object[]}
         */
        function getDisclaimers(flightInfo) {
          return _.chain(flightInfo.flight_list)
            .map((f) => f.disclaimer)
            .flatten()
            .uniqBy('id')
            .sortBy('id')
            .value()
        }

        ctrl.closeDepartureLocationSummaryAction = function(location) {
          location.departure.show = 1
          location.departure.summary.show = 0
          location.done = 0
          if(location.return) {
            location.return.show = 0
            if(location.return.summary.show === 0 &&
              !location.departure.selectingValueForFirstTime) {
              location.departure.selectingValueForFirstTime = 1
              location.return.selectingValueForFirstTime = 1
            }
          }

          ctrl.ui.showContinueButton = 0
        }

        ctrl.closeReturnLocationSummaryAction = function(location) {
          location.return.show = 1
          location.return.summary.show = 0
          ctrl.ui.showContinueButton = 0
          location.done = 0
        }
      }, 0)
    }
        // watch view states
    $scope.$watch('$ctrl.states', function(newState, oldState) {
      if(newState && newState.updateView === true) {
        ctrl.scrapHost()
      }
    })
  }
  SearchResultController.$inject = ['$scope', '$timeout', '$sce']

  angular
    .module('responsiveBookingEngine')
    .filter('strDuration', strDuration)
    .filter('strSimpleDate', strSimpleDate)

  return {
    bindings: {
      // object with states for the component
      states: '<?',
    },

    template:
    /* eslint-disable max-len */
    `<section class="m-flight-selection" data-ng-repeat="location in $ctrl.ui.locations" data-ng-class="{'done': location.done}">
        <div class="m-header" data-ng-if="$ctrl.ui.user_input_journey_type=='Multi City'" ng-cloak="ng-cloak"><strong>{{$index + 1}}</strong><span>{{location.extra_info.geo.origin_city_name}}
({{location.user_input_origin_airport_code}})
- {{location.extra_info.geo.destination_city_name}}
({{location.user_input_destination_airport_code}})</span></div>
        <div class="m-itinerary-summary" data-ng-show="location.departure.summary.show || !location.departure.selectingValueForFirstTime"
          ng-cloak="ng-cloak">
          <h4 class="title"></h4>
          <div class="itinerary-summary-flight itinerary-summary-flight--departure" data-ng-show="location.departure.summary.show">
            <div class="title">
              <div class="title-text title-text--primary" data-ng-if="$ctrl.ui.user_input_journey_type=='Round Trip'">{{ 'LABEL_FLIGHT_OUTBOUND' | translate }}</div><span class="close-text" data-ng-click="$ctrl.closeDepartureLocationSummaryAction(location)">{{ 'LABEL_SUMMARY_CLOSE_TITLE' | translate }}</span></div>
            <div
              class="flight-list-title">{{location.departure.dates[0].date | date:'MMMM d, y'}}</div>
          <div class="flight-list" data-ng-repeat="flight in location.departure.summary.flight_list">
            <div class="flight">
              <div class="l-flight-detail">
                <div class="flight-detail flight-detail--origin"><span class="location">{{flight.origin_airport_code}}</span><span class="time"> {{flight.departure_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == 'departure_time'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>
                <i
                  class="flight-direction"></i><span class="flight-duration--center" data-ng-if="flight.duration &amp;&amp; flight.duration &gt;= 0">{{flight.duration | duration}}</span>
                  <div
                    class="flight-detail flight-detail--destination"><span class="location">{{flight.destination_airport_code}}</span><span class="time"> {{flight.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == 'arrival_time'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>
            </div>
            <div class="flight-number text--linkify" data-ng-click="flight.numberEvent()">{{flight.number}}
              <div class="dialog-container" data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{$ctrl.ui.flightDetails.openDialog}}"
                data-bs-close-from-inner="$ctrl.ui.flightDetails.openDialog">
                <div class="m-flight-details-dialog">
                  <div class="m-dialog-head"><span>{{$ctrl.ui.flightDetails.data.dialogTitle}}</span><span class="close" data-ng-click="$ctrl.ui.flightDetails.openDialog=false">X</span></div>
                  <div
                    class="m-dialog-body">
                    <div class="m-loader m-loader--dialog-internal" data-ng-if="$ctrl.ui.flightDetails.isLoading">
                      <div class="icon--pure-css">Loading</div>
                    </div>
                    <table data-ng-if="$ctrl.ui.flightDetails.data.flight">
                      <tbody>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.flight.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.flight.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.airLine.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.airLine.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.from.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.from.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.timeTotal.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.timeTotal.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.to.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.to.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.timeFlying.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.timeFlying.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.date.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.date.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.equipment.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.equipment.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.depart.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.depart.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.timeGround.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.timeGround.valueText}}</td>
                        </tr>
                        <tr>
                          <td>{{$ctrl.ui.flightDetails.data.arrive.optText}}</td>
                          <td>{{$ctrl.ui.flightDetails.data.arrive.valueText}}</td>
                        </tr>
                        <tr data-ng-if="$ctrl.ui.flightDetails.data.rating.optText">
                          <td>{{$ctrl.ui.flightDetails.data.rating.optText}}</td>
                          <td ng-bind-html="$ctrl.ui.flightDetails.data.rating.valueText | sanitize"></td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="declaimer" data-ng-repeat="dec in flight.disclaimer | unique: 'id'">{{location.disclaimer_mapping[dec.id].text}}</div><br/></div>
    <div class="price" data-ng-if="location.departure.summary.price &gt;= 0"><span data-ng-if="$ctrl.ui.total_price.currency_code &gt;= 0">{{$ctrl.ui.total_price.currency_code}}</span><strong class="cash--after-discount"
        data-ng-if="location.departure.summary.cash_after_discount &gt; 0"> {{location.departure.summary.cash_after_discount | number:2 }}</strong>
      <strong
        class="cash" data-ng-class="{'price--deleted': location.departure.summary.cash_after_discount &gt; 0}" data-ng-if="location.departure.summary.price &gt; -1">
      {{location.departure.summary.price | number:2 }}</strong>
    </div>
  </div>
  </div>
  <div class="m-flights">
    <div class="m-departure" data-ng-show="location.departure.show" ng-cloak="ng-cloak">
      <div class="m-flight-options">
        <h4 class="doit"><i></i><span data-ng-if="$ctrl.ui.user_input_journey_type=='Multi City'">{{ 'LABEL_FLIGHT_DOIT_FLIGHT' | translate }}</span>
          <span
            data-ng-if="$ctrl.ui.user_input_journey_type!='Multi City'">{{ 'LABEL_FLIGHT_DOIT_OUTBOUND' | translate }}</span>
        </h4>
        <div>
          <h4 class="{{location.departure.selectedClassIndex.cssClass}}"><span>{{location.departure.dates[0].date | date:'fullDate'}}</span><button class="m-select-flight-class {{location.departure.selectedClassIndex.cssClass}}"
              data-ng-if="$ctrl.ui.user_input_journey_type!='Multi City'" data-ng-click="$ctrl.ui.clickBtnSelectFlightClass(true)">{{location.departure.selectedClassIndex.name}}</button></h4>
          <div
            class="dialog-container" data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{$ctrl.ui.departureDialogIsOpen}}"
            data-bs-close-from-inner="$ctrl.ui.departureDialogIsOpen">
            <div class="m-dialog-item" data-ng-repeat="option in location.departure.availableClasses track by option.name"
              data-ng-class="{'m-dialog-item-disabled': option.cheapestPrice === 'N/A', 'm-dialog-item-selected': option.selected}">
              <div class="m-item-col-left {{option.cssClass}}"><span data-ng-click="option.showDesc=!option.showDesc"><i class="icon--info-circled"></i></span></div>
              <div
                class="m-item-col-right" data-ng-click="$ctrl.ui.onSelectFlightClass(option, true, location)"><span class="m-item-name">{{option.name}}</span><span class="m-item-price"><strong class="cash--after-discount" data-ng-if="option.cash_after_discount &gt; 0"> {{option.cash_after_discount | number:2 }}</strong><strong class="cash" data-ng-class="{'price--deleted': option.cash_after_discount &gt; 0}" data-ng-if="option.cheapestPrice &gt; -1"> {{option.cheapestPrice | number:2 }}</strong></span>
                <ul
                  class="m-item-descriptions" data-ng-if="option.showDesc">
                  <li data-ng-repeat="liDesc in option.desc">{{liDesc}}</li>
                  </ul>
            </div>
        </div>
      </div>
      <div class="m-available-fligths" data-ng-if="location.departure.dates[0].flights.length &lt; 1">
        <div>{{ 'LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE' | translate }}</div>
      </div>
      <div class="m-available-fligths" data-ng-repeat="flight in location.departure.dates[0].flights" data-ng-class="{'non-available': flight.info.classes[location.departure.selectedClassIndex.id].price.cash == -1}">
        <div data-ng-click="$ctrl.selectFlightAction(flight, location, 'departure', $parent.$index, $event)">
          <div class="flight-time">
            <div data-ng-repeat="fInfo in flight.info.flight_list"><span class="departing"><strong class="time"> {{fInfo.departure_time | simpledate}}</strong><span class="location">{{fInfo.origin_airport_code}}</span></span>
              <i
                class="direction-going"></i><span class="returning"><strong class="time"> {{flight.info.arrival_time | simpledate}}</strong><span class="location">{{fInfo.destination_airport_code}}</span></span>
                <div
                  class="declaimer"><span data-ng-repeat="dec in fInfo.disclaimer" data-ng-if="dec.field == 'flight_number'">{{location.disclaimer_mapping[dec.id].text}}</span></div><br/></div>
          <span
            class="stops" data-ng-if="flight.info.flight_list.length &gt; 1">{{flight.info.flight_list.length - 1}} {{ 'LABEL_FLIGHT_STOPS' | translate }}</span><span class="stops" data-ng-if="flight.info.flight_list.length &lt;= 1">{{ 'LABEL_FLIGHT_NO_STOPS' | translate }}</span>
            <div
              class="flight-duration" data-ng-if="flight.info.duration &amp;&amp; flight.info.duration &gt;= 0"> - {{flight.info.duration | duration}}</div>
      </div>
      <div class="flight-price"><strong class="cash--after-discount" data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount &gt; 0">{{flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount | number:2 }}</strong>
        <strong
          class="cash" data-ng-class="{'price--deleted': flight.info.classes[location.departure.selectedClassIndex.id].price.cash_after_discount &gt; 0}"
          data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash &gt; -1">{{flight.info.classes[location.departure.selectedClassIndex.id].price.cash | number:2 }}</strong><strong data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash == -1">N/A</strong></div>
      <div
        class="flight-selling-class" data-ng-if="flight.info.classes[location.departure.selectedClassIndex.id].price.cash &gt;= 0"><span>(<a data-ng-click="flight.info.classes[location.departure.selectedClassIndex.id].sellingClass.click($event); $ctrl.ui.sellingClass.isDeparture=true">{{flight.info.classes[location.departure.selectedClassIndex.id].sellingClass.text}}</a>)</span></div>
    <div
      class="dialog-container" data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{$ctrl.ui.sellingClass.openDialog}}" data-bs-close-from-inner="$ctrl.ui.sellingClass.openDialog">
      <div class="m-selling-class-dialog">
        <div class="m-dialog-head"><span data-ng-if="$ctrl.ui.sellingClass.isDeparture">{{location.departure.selectedClassIndex.name}}</span><span class="close"
            data-ng-click="$ctrl.ui.sellingClass.openDialog=false">X</span><span data-ng-if="!$ctrl.ui.sellingClass.isDeparture">{{location.return.selectedClassIndex.name}}</span></div>
        <div
          class="m-dialog-body">
          <div class="m-loader m-loader--dialog-internal" data-ng-if="$ctrl.ui.sellingClass.isLoading">
            <div class="icon--pure-css"></div>
          </div>
          <div data-ng-if="!$ctrl.ui.sellingClass.isLoading" data-ng-bind-html="$ctrl.ui.sellingClass.html"></div>
      </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  <div class="m-itinerary-summary" data-ng-show="location.departure.summary.show || !location.departure.selectingValueForFirstTime"
    ng-cloak="ng-cloak">
    <h4 class="title"></h4>
    <div class="itinerary-summary-flight itinerary-summary-flight--return" data-ng-show="location.return.summary.show">
      <div class="title">
        <div class="title-text title-text--primary" data-ng-if="$ctrl.ui.user_input_journey_type=='Round Trip'">{{ 'LABEL_FLIGHT_INBOUND' | translate }}</div><span class="close-text" data-ng-click="$ctrl.closeReturnLocationSummaryAction(location)">{{ 'LABEL_SUMMARY_CLOSE_TITLE' | translate }}</span></div>
      <div
        class="flight-list-title">{{location.return.dates[0].date | date:'MMMM d, y'}}</div>
    <div class="flight-list" data-ng-repeat="flight in location.return.summary.flight_list">
      <div class="flight">
        <div class="l-flight-detail">
          <div class="flight-detail flight-detail--origin"><span class="location">{{flight.origin_airport_code}}</span><span class="time"> {{flight.departure_time |simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == 'departure_time'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>
          <i
            class="flight-direction"></i><span class="flight-duration--center" data-ng-if="flight.duration &amp;&amp; flight.duration &gt;= 0">{{flight.duration | duration}}</span>
            <div
              class="flight-detail flight-detail--destination"><span class="location">{{flight.destination_airport_code}}</span><span class="time"> {{flight.arrival_time | simpledate}}<sup data-ng-repeat="dec in flight.disclaimer" data-ng-if="dec.field == 'arrival_time'">{{location.disclaimer_mapping[dec.id].symbol}}</sup></span></div>
      </div>
      <div class="flight-number text--linkify" data-ng-click="flight.numberEvent()">{{flight.number}}</div>
    </div>
    <div class="declaimer" data-ng-repeat="dec in flight.disclaimer | unique: 'id'">{{location.disclaimer_mapping[dec.id].text}}</div>
  </div>
  <div class="price" data-ng-if="location.return.summary.price &gt;= 0"><span data-ng-if="$ctrl.ui.total_price.currency_code &gt;= 0">{{$ctrl.ui.total_price.currency_code}}</span><strong class="cash--after-discount"
      data-ng-if="location.return.summary.cash_after_discount &gt; 0"> {{location.return.summary.cash_after_discount}}</strong>
    <strong
      class="cash" data-ng-class="{'price--deleted': location.return.summary.cash_after_discount &gt; 0}" data-ng-if="location.return.summary.price &gt; -1">
    {{location.return.summary.price | number:2 }}</strong>
  </div>
  </div>
  </div>
  <div class="m-flights">
    <div class="m-return" data-ng-if="location.return" data-ng-show="location.return.show" ng-cloak="ng-cloak">
      <div class="m-flight-options m-inbound-flight-options">
        <h4 class="doit"><i></i><span>{{ 'LABEL_FLIGHT_DOIT_INBOUND' | translate }}</span></h4>
        <h4 class="{{location.return.selectedClassIndex.cssClass}}"><span>{{location.return.dates[0].date | date:'fullDate'}}</span><button class="m-select-flight-class {{location.return.selectedClassIndex.cssClass}}"
            data-ng-if="$ctrl.ui.user_input_journey_type!='Multi City'" data-ng-click="$ctrl.ui.clickBtnSelectFlightClass(false)">{{location.return.selectedClassIndex.name}}</button></h4>
        <div
          class="dialog-container" data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{$ctrl.ui.returnDialogIsOpen}}" data-bs-close-from-inner="$ctrl.ui.returnDialogIsOpen">
          <div class="m-dialog-item" data-ng-repeat="option in location.return.availableClasses track by option.name" data-ng-class="{'m-dialog-item-disabled': option.cheapestPrice === 'N/A', 'm-dialog-item-selected': option.name === location.return.selectedClassIndex.name}">
            <div class="m-item-col-left {{option.cssClass}}"><span data-ng-click="option.showDesc=!option.showDesc"><i class="icon--info-circled"></i></span></div>
            <div class="m-item-col-right"
              data-ng-click="$ctrl.ui.onSelectFlightClass(option, false, location)"><span class="m-item-name">{{option.name}}</span><span class="m-item-price"><strong class="cash--after-discount" data-ng-if="option.cash_after_discount &gt; 0"> {{option.cash_after_discount | number:2 }}</strong><strong class="cash" data-ng-class="{'price--deleted': option.cash_after_discount &gt; 0}" data-ng-if="option.cheapestPrice &gt; -1"> {{option.cheapestPrice | number:2 }}</strong></span>
              <ul
                class="m-item-descriptions" data-ng-if="option.showDesc">
                <li ng-repeat="liDesc in option.desc">{{liDesc}}</li>
                </ul>
            </div>
          </div>
      </div>
      <div class="m-available-fligths" data-ng-if="location.return.dates[0].flights.length &lt; 1">
        <div>{{ 'LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE' | translate }}</div>
      </div>
      <div class="m-available-fligths" data-ng-repeat="flight in location.return.dates[0].flights" data-ng-class="{'non-available': flight.info.classes[location.return.selectedClassIndex.id].price.cash == -1}"
        data-ng-if="location.return.dates[0].flights.length &gt; 0">
        <div data-ng-click="$ctrl.selectFlightAction(flight, location, 'return', $parent.$index, $event)">
          <div class="flight-time">
            <div data-ng-repeat="fInfo in flight.info.flight_list"><span class="departing"><strong class="time"> {{fInfo.departure_time |simpledate}}</strong><span class="location">{{fInfo.origin_airport_code}}</span></span>
              <i
                class="direction-going"></i><span class="returning"><strong class="time"> {{fInfo.arrival_time |simpledate}}</strong><span class="location">{{fInfo.destination_airport_code}}</span></span>
                <div
                  class="declaimer"><span data-ng-repeat="dec in fInfo.disclaimer" data-ng-if="dec.field == 'flight_number'">{{location.disclaimer_mapping[dec.id].text}}</span></div>
          </div><span class="stops" data-ng-if="flight.info.flight_list.length &gt; 1">{{flight.info.flight_list.length - 1}} {{ 'LABEL_FLIGHT_STOPS' | translate }}</span>
          <span
            class="stops" data-ng-if="flight.info.flight_list.length &lt;= 1">{{ 'LABEL_FLIGHT_NO_STOPS' | translate }}</span>
            <div class="flight-duration" data-ng-if="flight.info.duration &amp;&amp; flight.info.duration &gt;= 0"> - {{flight.info.duration | duration}}</div>
        </div>
        <div class="flight-price"><strong class="cash--after-discount" data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount &gt; 0">{{flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount | number:2 }}</strong>
          <strong
            class="cash" data-ng-class="{'price--deleted': flight.info.classes[location.return.selectedClassIndex.id].price.cash_after_discount &gt; 0}"
            data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash &gt; -1">{{flight.info.classes[location.return.selectedClassIndex.id].price.cash | number:2 }}</strong><strong data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash == -1">N/A</strong></div>
      </div>
      <div class="flight-selling-class" data-ng-if="flight.info.classes[location.return.selectedClassIndex.id].price.cash &gt;= 0"><span>(<a data-ng-click="flight.info.classes[location.return.selectedClassIndex.id].sellingClass.click($event); $ctrl.ui.sellingClass.isDeparture=false">{{flight.info.classes[location.return.selectedClassIndex.id].sellingClass.text}}</a>)</span></div>
      <div
        class="dialog-container" data-jqui-dialog="data-jqui-dialog" data-bs-open-dialog="{{$ctrl.ui.sellingClass.openDialog}}" data-bs-close-from-inner="$ctrl.ui.sellingClass.openDialog">
        <div class="m-selling-class-dialog">
          <div class="m-dialog-head"><span data-ng-if="$ctrl.ui.sellingClass.isDeparture">{{location.departure.selectedClassIndex.name}}</span><span class="close"
              data-ng-click="$ctrl.ui.sellingClass.openDialog=false">X</span><span data-ng-if="!$ctrl.ui.sellingClass.isDeparture">{{location.return.selectedClassIndex.name}}</span></div>
          <div
            class="m-dialog-body">
            <div class="m-loader m-loader--dialog-internal" data-ng-if="$ctrl.ui.sellingClass.isLoading">
              <div class="icon--pure-css"></div>
            </div>
            <div data-ng-if="!$ctrl.ui.sellingClass.isLoading" data-ng-bind-html="$ctrl.ui.sellingClass.html"></div>
        </div>
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </section>`,
    controller: SearchResultController,
  }
})

