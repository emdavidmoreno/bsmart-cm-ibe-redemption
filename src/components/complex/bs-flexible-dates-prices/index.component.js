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
   */
  function FlexibleDatesPricesController($scope, $element, $attrs, $timeout) {
    let ctrl = this
    /**
     * On change handler
     */
    ctrl.handlerOnChange = function() {
      // invoke when the value change
      ctrl.onUpdate({value: 0})
    }

    /**
     * Init component
     */
    ctrl.$onInit = function() {
      ctrl.cellsData = helper.getCells()

      ctrl.cellClick = function(cell) {
        cell.onClick()

        for(let [, v] of Object.entries(ctrl.cellsData.outboundDates)) {
          v.forEach((value) => {
            value.isSelected = false
          })
        }
        cell.isSelected = true
      }
    }
  }

  FlexibleDatesPricesController.$inject = [
    '$scope', '$element', '$attrs', '$timeout',
  ]

  return {
    bindings: {
      // farenet model
      farenetModel: '<',
      // view states
      states: '<',
    },
    template:
    `<div class="flexible-dates-prices table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th> </th>
            <th data-ng-repeat="(inboundDate, value) in $ctrl.cellsData.inboundDates">
              {{ inboundDate | date:'MMM dd'}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr data-ng-repeat="(outboundDate, value) in $ctrl.cellsData.outboundDates">
            <th> {{ outboundDate | date:'MMM dd'}} </th>
            <td
              data-ng-repeat="cell in value"
              data-ng-click="$ctrl.cellClick(cell)"
              data-ng-class="{selected: cell.isSelected}">
              {{ cell.price }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
    controller: FlexibleDatesPricesController,
  }
})
