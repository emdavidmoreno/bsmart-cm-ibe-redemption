/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function (helper) {
  'use strict'
  /**
   * FlexibleDatesPrices Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function bsTotalPriceSummaryController(
    $scope, $element, $attrs, $timeout, $filter
  ) {
    let ctrl = this
    /**
     * Init component
     */
    ctrl.$onInit = function () {
      syncUI()
    }
    /**
     * Get Host UI info
     */
    const syncUI = () => {
      ctrl.priceInfoList = []
      ctrl.existSeatTable = helper.existSeatTable()
      ctrl.existCOP = helper.existCOP()
      ctrl.seatInfoList = helper.getPriceSeatsInfo()     
      ctrl.totalPrice = ctrl.getTotalPrice()
      ctrl.priceInfoList = helper.getPriceBaseInfo()
      ctrl.link = helper.getLinkOption()
      $timeout(function () {  
        ctrl.existInsuranceTable = helper.existInsuranceTable() 
        ctrl.priceInsuranceInfo = helper.getPriceInsuranceInfo() 
        ctrl.totalPrice = ctrl.getTotalPrice()    
        ctrl.totalPriceLabel = helper.getTotalPriceLabel() 
       }, 1000)
    }

    ctrl.getTotalPrice = function(){      
      let p = helper.getTotalPrice().split(" ");
      return `${p[0]} ${$filter('priceFormat')(helper.formatPrice(p[0], p[1]))}`
    }

    ctrl.getTotalPrice()

    ctrl.$onChanges = function (obj) {
      if (obj.showInsurance) {        
        syncUI();
      }
    }
  }

  bsTotalPriceSummaryController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      showInsurance: '<?'

    },
    /* eslint-disable max-len */
    template:
    `<section ng-if="$ctrl.totalPrice != 'undefined'">
        <div class="m-card m-card--warning">
          <div class="content price-summary" ng-cloak>
            <p>
              <strong>
                {{ "LABEL_BASE_PRICE" | translate }} :
              </strong>
              <span class="pull-right">
                {{ $ctrl.priceInfoList[0] }}
              </span>
            </p>
            <p data-ng-if="$ctrl.existCOP">
              <strong>
                {{"Expo F"}} :
              </strong>
              <span class="pull-right">
                {{ $ctrl.priceInfoList[1] }}
              </span>
            </p>
            <p>
              <strong>
                {{ "LABEL_FUEL_SUBCHARGES" | translate }} :
              </strong>
              <span data-ng-if="$ctrl.existCOP" class="pull-right">
                {{$ctrl.priceInfoList[2]}}
              </span>
              <span data-ng-if="!$ctrl.existCOP" class="pull-right">
                {{$ctrl.priceInfoList[1]}}
              </span>
            </p>
                   
            <p>
              <strong>
                {{ "LABEL_TAXES" | translate }} :
              </strong>
              <span data-ng-if="$ctrl.existCOP"  class="pull-right">
                {{$ctrl.priceInfoList[3]}}
              </span>
              <span data-ng-if="!$ctrl.existCOP"  class="pull-right">
                {{$ctrl.priceInfoList[2]}}
              </span>
            </p>
            <p data-ng-if="$ctrl.existInsuranceTable">
              <strong>
                {{ "LABEL_INSURANCE" | translate }} :
              </strong>
              <span class="pull-right">
                 {{$ctrl.priceInsuranceInfo}}
              </span>
            </p>
             <p data-ng-if="$ctrl.existSeatTable" data-ng-repeat="seatInfo in $ctrl.seatInfoList">
              <span>
                <strong>
                  {{ "LABEL_SEAT" | translate }}: {{ seatInfo.title }}
                </strong>
                <span class="pull-right">
                  {{ seatInfo.price }}
                  <div data-ng-bind-html="$ctrl.link | sanitize"> </div>
                </span>
              </span>
            </p>
          </div>
          <header class="title">
            <h4 class="title-text">
              {{ $ctrl.totalPriceLabel }}
              <strong class="title-text--right">
                {{$ctrl.totalPrice}}
              </strong>
            </h4>
          </header>
        </div>
      </section>`,
    controller: bsTotalPriceSummaryController,
  }
})
