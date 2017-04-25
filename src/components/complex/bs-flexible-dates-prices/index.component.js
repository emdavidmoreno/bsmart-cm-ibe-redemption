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
  function FlexibleDatesPricesController(
    $scope, $element, $attrs, $timeout, $filter
    ) {
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
      ctrl.isInitialPosition = true
      ctrl.lowestPrice = 9999
      ctrl.cellsData = getCellsInfo()
      ctrl.cellClick = function(cell, rowValue) {
        if(cell.isNotAvail) return

        cell.onClick()
        for(let [, v] of Object.entries(ctrl.cellsData.outboundDates)) {
          v.cellInfo.forEach((value) => {
            value.isSelected = false
          })
          v.rowSelected = false
        }
        for(let [, v] of Object.entries(ctrl.cellsData.inboundDates)) {
          v.isCollSelected = false
        }

        cell.isSelected = true
        rowValue.rowSelected = true
        ctrl.cellsData.inboundDates[cell.inboundDate].isCollSelected = true
      }
    }

    ctrl.moveScroll = function() {
      let $div = $('.flexible-dates-prices.table-responsive')
      if($div.scrollLeft() > 0) {
        $div.scrollLeft(0)
        ctrl.isInitialPosition = true
      } else {
        $div.scrollLeft($div.width())
        ctrl.isInitialPosition = false
      }
    }
    /**
     * Return cells info
     * @return {Object}
     */
    function getCellsInfo() {
      const matrix = ctrl.farenetModel.matrix_total_price
      let cells = {
        outboundDates: {},
        inboundDates: {},
      }
      /**
       * Retrun number of ms
       *
       * @param {String} date
       * @return {int}
       */
      const getTime = function(date) {
        let [year, month, day] = date.split('-')
        month = parseInt(month) - 1
        return (new Date(year, month, day, 0, 0, 0)).getTime()
      }
      /**
       * Retrun formated date as array
       *
       * @param {String} date
       * @return {String[]}
       */
      const getFormatedDateAsArray = function(date) {
        return $filter('date')(date, 'MMM dd').split(' ')
      }

      for(let [k, v] of Object.entries(matrix)) {
        let [outboundDate, inboundDate] = k.split('_')
        let msOutboundDate = getTime(outboundDate)
        let msInboundDate = getTime(inboundDate)
        if(!cells.inboundDates.hasOwnProperty(msInboundDate)) {
          cells.inboundDates[msInboundDate] = {
            format: getFormatedDateAsArray(inboundDate),
            isCollSelected: false,
          }
        }

        if(!cells.outboundDates.hasOwnProperty(msOutboundDate)) {
          cells.outboundDates[msOutboundDate] = {
            cellInfo: [],
            rowSelected: v.isSelected,

          }
        }

        if(!cells.outboundDates[msOutboundDate].rowSelected &&
          v.isSelected) {
          cells.outboundDates[msOutboundDate].rowSelected = v.isSelected
          cells.inboundDates[msInboundDate].isCollSelected = v.isSelected
        }

        // first element on this array is the formated date
        // as array, for table head
        cells.outboundDates[msOutboundDate].cellInfo.push({
          format: getFormatedDateAsArray(outboundDate),
        })
        cells.outboundDates[msOutboundDate].cellInfo.push(
          Object.assign({}, v, {
            inboundDate: msInboundDate,
            isPriceText: isNaN(v.price),
            onClick: function() {
              if(!this.isNotAvail) {
                this.cell[0].click()
              }
            },
          })
        )
        if(v.price < ctrl.lowestPrice) {
          ctrl.lowestPrice = v.price
        }
      }

      return cells
    }
  }

  FlexibleDatesPricesController.$inject = [
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
    `
    <div>
      <div class="m-btn"
        data-ng-click="$ctrl.moveScroll()"
        data-ng-class="{'m-btn-left': !$ctrl.isInitialPosition}">
        <span> </span>
      </div>
      <div class="m-return-label">
        <span> {{ 'LABEL_FD_RETURN' | translate }} </span>
        <span>  &rarr; </span>
      </div>
    </div>
    <div class="flexible-dates-prices table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="m-depart-label">
              <span> {{ 'LABEL_FD_DEPART' | translate }} </span>
              <span> &darr; </span>
            </th>
            <th
              data-ng-repeat="(inboundDate, value) in $ctrl.cellsData.inboundDates"
              class="flexible-dates" data-ng-class="{'selected-price': value.isCollSelected}">
              <span data-ng-repeat="s in value.format">
                {{s}}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr data-ng-repeat="(outboundDate, rowValue) in $ctrl.cellsData.outboundDates">
            <th class="flexible-dates" data-ng-class="{'selected-price': rowValue.rowSelected}">
              <span data-ng-repeat="s in rowValue.cellInfo[0].format">
                {{s}}
              </span>
            </th>
            <td
              data-ng-repeat="cell in rowValue.cellInfo"
              data-ng-click="$ctrl.cellClick(cell, rowValue)"
              data-ng-class="{'selected-price': cell.isSelected, 'lower-prices': cell.price == $ctrl.lowestPrice, 'm-have-price': !cell.isPriceText}"
              data-ng-if="!cell.format"
              class='flexible-dates-price'>
              <span data-ng-if="!cell.isPriceText">{{ cell.price | currency : "" }}</span>
              <span data-ng-if="cell.isPriceText">{{ cell.price }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
    controller: FlexibleDatesPricesController,
  }
})
