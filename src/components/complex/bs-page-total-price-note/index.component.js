/**
 * Angular component
 */
define(['./helpers/scrapHelper'], function(helper) {
  'use strict'
  /**
   * PageTotalPrice Controller
   *
   * @param {Object} [$scope]
   * @param {Object} [$element]
   * @param {Object} [$attrs]
   * @param {Object} [$timeout]
   * @param {Function} [$filter]
   */
  function PageTotalPriceController(
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
      ctrl.notImportantNotes = helper.getNotImportantNotes()
      ctrl.importantNotes = helper.getImportantNotes()
    }
  }

  PageTotalPriceController.$inject = [
    '$scope', '$element', '$attrs', '$timeout', '$filter',
  ]

  return {
    bindings: {
      // view states
      states: '<?',
    },
    /* eslint-disable max-len */
    template:
    `<section data-ng-if="$ctrl.notImportantNotes.length > 0 || $ctrl.importantNotes.length > 0">
      <div class="m-card m-card--flat m-card--bordered"
        data-ng-if="$ctrl.importantNotes.length > 0">
        <div class="content content--small-vertical-padding">
          <div class="notes-important" data-ng-bind-html="$ctrl.importantNotes | sanitize">
          </div>
        </div>
      </div>
      <div class="m-card m-card--flat m-card--bordered"
        data-ng-if="$ctrl.notImportantNotes.length > 0">
        <div class="content content--small-vertical-padding">
          <div data-ng-bind-html="$ctrl.notImportantNotes | sanitize">
          </div>
        </div>
      </div>
    </section>`,
    controller: PageTotalPriceController,
  }
})
