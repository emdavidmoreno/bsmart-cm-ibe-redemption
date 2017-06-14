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
  function MultiplePaymentSelector(
    $scope, $element, $attrs, $timeout, $filter
    ) {
    let ctrl = this
    /**
     * @param {Object} states
     */
    const updateStates = (states) => {
      ctrl.updateStates({states})
    }

    /**
     * Init component
     */
    ctrl.$onInit = function() {
      setupUI()
    }

    /**
     * Post link
     */
    ctrl.$postLink = function() {
      let states = {
        showBlockPayments: ctrl.paymentBlocks.length !== 0,
        pse: false,
        cc: false,
        bankTransfers: false,
      }

      ctrl.paymentBlocks.forEach((block) => {
        if(block.type === 'PAGOSPSE' && block.isSelected) {
          states['pse'] = true
        } else if(block.type === 'CREDITCARD_POS' && block.isSelected) {
          states['cc'] = true
        } else if(block.type === 'BANKTRANSFERS' && block.isSelected) {
          states['bankTransfers'] = true
        }
      })

      updateStates(states)
    }

    /**
     * Handler invocado cuando se da click en el
     * radio button
     *
     * @param {Object} block
     */
    ctrl.hOnChange = function(block) {
      ctrl.paymentBlocks.forEach((b) => {
        b.forceDeselect()
      })
      block.hOnClick()
      updateStates({
        pse: (block.type === 'PAGOSPSE' && block.isSelected),
        cc: (block.type === 'CREDITCARD_POS' && block.isSelected),
        bankTransfers: (block.type === 'BANKTRANSFERS' && block.isSelected),
      })
    }

    /**
     * Setup
     */
    function setupUI() {
      ctrl.paymentBlocks = helper.getPaymentBlocks()
    }
  }

  MultiplePaymentSelector.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<',
      // update global states
      updateStates: '&',
    },
    /* eslint-disable max-len */
    template:
      `<section>
        <div class="m-card" data-ng-repeat="block in $ctrl.paymentBlocks">
          <div class="content">
            <div class="m-input">
              <input type="checkbox"
                name="payment-block"
                data-ng-change="$ctrl.hOnChange(block)"
                data-ng-model="block.isSelected"/>
            </div>
            <div class="m-logo" data-ng-bind-html="block.logoHtml | sanitize">
            </div>
            <div class="m-descr" data-ng-bind-html="block.descrHtml | sanitize">
            </div>
          </div>
        </div>
      </section>`,
    controller: MultiplePaymentSelector,
  }
})
