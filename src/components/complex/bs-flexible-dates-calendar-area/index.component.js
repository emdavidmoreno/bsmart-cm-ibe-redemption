/**
 * Angular component
 */
define(['./helpers/scrapHelper',
  './helpers/bindHostFunctions'], function(helper, bindHostFunctions) {
  'use strict'
  /**
   * FlexibleDatesCalendarArea Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function FlexibleDatesCalendarAreaController(
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
      setupUI()
      scrapHostUI()
      initScrollView()
    }

    ctrl.$onDestroy = function() {
      bindHostFunctions.restore()
    }

    /**
     * Init Scroll View
     */
    function initScrollView() {
      if(ctrl.tabsInfo[0].isVisible) {
        ctrl.tabsInfo[1].isVisible = true
        ctrl.tabsInfo[2].isVisible = true
        ctrl.isFirstTab = true
      } else if(ctrl.tabsInfo[ctrl.tabsInfo.length - 1].isVisible) {
        let lastIndex = ctrl.tabsInfo.length - 1
        ctrl.tabsInfo[--lastIndex].isVisible = true
        ctrl.tabsInfo[--lastIndex].isVisible = true
        ctrl.isLastTab = true
      } else {
        let stopFound = false
        for(let i = 0; i < ctrl.tabsInfo.length && !stopFound; i++) {
          let current = ctrl.tabsInfo[i]
          if(current.isVisible) {
            ctrl.tabsInfo[i - 1].isVisible = true
            ctrl.tabsInfo[i + 1].isVisible = true
            stopFound = true
          }
        }
      }
    }

    ctrl.showNextTab = function() {
      ctrl.isFirstTab = false
      const len = ctrl.tabsInfo.length
      let it = 0
      let countVisible = 3
      while(it < len) {
        let current = ctrl.tabsInfo[it]
        if(current.isVisible) {
          --countVisible
          if(!countVisible) {
            const nextIt = it + 1
            if(len > nextIt) {
              ctrl.tabsInfo[nextIt].isVisible = true
              ctrl.tabsInfo[it - 2].isVisible = false
            }
          }
        }
        ++it
      }
      ctrl.isLastTab = ctrl.tabsInfo[len - 1].isVisible
    }

    ctrl.showPrevTab = function() {
      ctrl.isLastTab = false
      let it = ctrl.tabsInfo.length - 1
      let countVisible = 3
      while(it) {
        let current = ctrl.tabsInfo[it]
        if(current.isVisible) {
          --countVisible
          if(!countVisible) {
            const prevIt = it - 1
            if(prevIt >= 0) {
              ctrl.tabsInfo[prevIt].isVisible = true
              ctrl.tabsInfo[it + 2].isVisible = false
            }
          }
        }
        --it
      }
      ctrl.isFirstTab = ctrl.tabsInfo[0].isVisible
    }

    ctrl.tabClick = function(tab) {
      if(tab.isDisabledTab) {
        return
      }
      ctrl.tabsInfo.forEach((t) => {
        t.selected = false
      })
      tab.onClick()
      tab.selected = true
    }

    /**
     * setupUI
     */
    function setupUI() {
      bindHostFunctions.bindFn(
        () => {
          updateStates({
            showLoading: true,
            updateView: null,
          })
        },
        () => {
          $timeout(() => {
            scrapHostUI(true)
            updateStates({
              showLoading: false,
              updateView: true,
            })
          }, 50)
        }
        )
    }
    /**
     * Scrap UI
     * @param {bool} isForce
     */
    function scrapHostUI(isForce) {
      ctrl.isLastTab = false
      ctrl.isFirstTab = false
      const tabsInfoDict = helper.getTabsInfo()
      if(!isForce) {
        ctrl.tabsInfo = []
        for( let [k, v] of Object.entries(tabsInfoDict)) {
          v.timestamp = k
          v.date = getFormatedDateAsArray(k)
          v.isVisible = v.selected
          ctrl.tabsInfo.push(v)
        }
      } else {
        for( let [k, v] of Object.entries(tabsInfoDict)) {
          ctrl.tabsInfo.forEach((tab) => {
            if(k === tab.timestamp) {
              tab.selected = v.selected
              tab.hostTab = v.hostTab
            }
          })
        }
      }
    }
    /**
     * Update States
     * @param {Object} states
     */
    function updateStates(states) {
      if(ctrl.updateStates) {
        ctrl.updateStates({
          states: Object.assign(states, {
            id: Date.now(),
          }),
        })
      }
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
  }

  FlexibleDatesCalendarAreaController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<',
      // update state props
      updateStates: '&',
    },
    /* eslint-disable max-len */
    template:
    `
      <div tabindex="0" class="m-prev" data-ng-click="$ctrl.showPrevTab()" 
      data-ng-keypress="$ctrl.showPrevTab()" data-ng-hide="$ctrl.isFirstTab" ><span></span></div>
      <div class="m-container">
        <div data-ng-repeat="tab in $ctrl.tabsInfo"
          tabindex="0"
          data-ng-if="tab.isVisible"
          data-ng-class="{'m-tab-selected': tab.selected}"
          data-ng-disable="tab.isDisabledTab"
          data-ng-click="$ctrl.tabClick(tab)"
          class="m-tab-info"
          >
          <span data-ng-repeat="d in tab.date">
            {{ d }}
          </span>
          <span class="m-lower-price" data-ng-if="!tab.isPriceText"> {{ tab.lowerPrice | currency: ""}} </span>
          <span class="m-lower-price" data-ng-if="tab.isPriceText"> {{ tab.lowerPrice }} </span>
        </div>
      </div>
      <div tabindex="0" class="m-next" data-ng-click="$ctrl.showNextTab()" 
      data-ng-keypress="$ctrl.showNextTab()" 
      data-ng-hide="$ctrl.isLastTab"><span></span></div>
    `,
    controller: FlexibleDatesCalendarAreaController,
  }
})
