/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
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
  function DetailSeatsPricesController(
    $scope, $element, $attrs, $timeout, $filter
    ) {
    let ctrl = this
    /**
     * Init component
     */
    ctrl.$onInit = function() {
      ctrl.seatInfoList = []
      setupUI()
    }
    /**
     * Get Host UI info
     */
    const setupUI = () => {
      ctrl.seatInfoList = helper.getSeatsInfo()
      ctrl.totalPrice = helper.getTotalPrice()
      ctrl.headerInfo = helper.getHeaderInfo()
    }
  }

  DetailSeatsPricesController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<?',
    },
    /* eslint-disable max-len */
    template:
    `<section data-ng-if="$ctrl.seatInfoList.length > 0">
        <div class="m-card-top-header">
          <h3>
            {{$ctrl.headerInfo.title}}
          </h2>
          <div data-ng-bind-html="$ctrl.headerInfo.link | sanitize"> </div>
        </div>
        <div class="m-card m-card--warning">
          <div class="content price-summary content--small-vertical-padding" ng-cloak>
            <p data-ng-repeat="seatInfo in $ctrl.seatInfoList">
              <span>
                <strong>
                  {{ seatInfo.title }}
                </strong>
                <span class="pull-right">
                  {{ seatInfo.price }}
                </span>
              </span>
              <small> {{ seatInfo.details }} - {{seatInfo.seat}} </small>
            </p>
          </div>
          <header class="title">
            <h4 class="title-text">
              {{ "LABEL_TOTAL" | translate }}
              <strong class="title-text--right">
                {{ $ctrl.totalPrice  }}
              </strong>
            </h4>
          </header>
        </div>
      </section>`,
    controller: DetailSeatsPricesController,
  }
})
