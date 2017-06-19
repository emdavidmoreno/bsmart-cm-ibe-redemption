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
  function PseDetails(
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
      ctrl.psiDetailList = helper.getPseDetails()
      ctrl.headerText = helper.getHeaderName()
    }
  }

  PseDetails.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<?',
    },
    /* eslint-disable max-len */
    template:
    `<section data-ng-if="$ctrl.psiDetailList.length > 0">
      <h3> {{ $ctrl.headerText }} </h3>
      <div class="m-card m-card--flat m-card--bordered">
        <div class="content content--small-vertical-padding">
          <div class="flexible-dates-prices table-responsive">
            <table class="table table-bordered">
              <tbody>
                <tr data-ng-repeat="info in $ctrl.psiDetailList">
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
    controller: PseDetails,
  }
})
