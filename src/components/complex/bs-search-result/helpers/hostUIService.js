'use strict'

define([
  'lodash',
  './wrap-host-selling-class-fn',
  './wrap-host-popup-framework-callback',
], function(_, sellingClass, popupFrameworkCallbak) {
  /**
   * @return {Object}
   */
  function hostUIService() {
    return _.assign({}, sellingClass, popupFrameworkCallbak)
  }

  hostUIService.$inject = []
  return hostUIService
})
