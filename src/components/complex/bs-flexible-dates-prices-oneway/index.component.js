/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
  'use strict'
  /**
   * FlexibleDatesPricesOneWay Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function FlexibleDatesPricesOneWayController($scope, $element, $attrs, $timeout, $filter) {
    let ctrl = this
    ctrl.helper = helper;
    ctrl.weeks = [];

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
     ctrl.priceCalendar = ctrl.helper.getTableData();
     ctrl.fillPricesByWeek()
   
      ctrl.cellClick = function(cell) {
        if(cell.price === "N/D") return

         cell.onClick()
         cell.isSelected = true
       
      }
    }

    ctrl.fillPricesByWeek = function(){
          for (var i = 0; i <  ctrl.priceCalendar.m_prices.length; i++) {
                if (i % 7 == 0) {
                    ctrl.weeks.push([]);
                }
                ctrl.weeks[ctrl.weeks.length-1].push(ctrl.priceCalendar.m_prices[i]);
            }

    }
    


 
  }

  FlexibleDatesPricesOneWayController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // farenet model
      farenetModel: '<',
      // view states
      states: '<',
    },
    /* eslint-disable max-len */
    template:
    `<div class="flexible-dates-prices table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th
              data-ng-repeat=" day in  $ctrl.priceCalendar.m_days"
              class="flexible-dates">
              <span>
                {{day}}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr   data-ng-repeat="week in $ctrl.weeks track by $index" >
             <td data-ng-repeat="priceByDay in week track by $index"
              data-ng-click="$ctrl.cellClick(priceByDay)"
              data-ng-class="{'selected-price': priceByDay.isSelected}"
              class='flexible-dates-price'>
              <span>{{ priceByDay.price }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
    controller: FlexibleDatesPricesOneWayController,
  }
})
