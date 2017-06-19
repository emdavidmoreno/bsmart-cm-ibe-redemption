/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
  'use strict'
  /**
   * BankTransferDetails Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function BankTransferDetailsController(
    $scope, $element, $attrs, $timeout, $filter
    ) {
    let ctrl = this

    /**
     * Init component
     */
    ctrl.$onInit = function() {
      setUpUi()
    }
    /**
     * setUpUi
     */
    function setUpUi() {
      ctrl.itemList = helper.getBankTransferDetails()
      ctrl.headerText = helper.getHeaderName()
    }
  }

  BankTransferDetailsController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<?',
    },
    /* eslint-disable max-len */
    template:
    `<section data-ng-if="$ctrl.itemList.length > 0">
      <div class="m-card m-card--flat m-card--bordered">
        <header class="title">
          <h3 class="title-text"> {{ $ctrl.headerText }} </h3>
        </header>
        <div class="content content--small-vertical-padding">
          <div class="flexible-dates-prices table-responsive">
            <table class="table table-bordered">
              <tbody>
                <tr data-ng-repeat="info in $ctrl.itemList">
                  <th class="flexible-dates">
                    <p>
                      {{info.name}}
                    </p>
                  </th>
                  <td>
                    <p>{{ info.value }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>`,
    controller: BankTransferDetailsController,
  }
})
