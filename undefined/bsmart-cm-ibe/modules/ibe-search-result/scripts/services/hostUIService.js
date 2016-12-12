'use strict';

define([
  'lodash',
  '../../../../scripts/helpers/wrap-host-selling-class-fn',
  '../../../../scripts/helpers/wrap-host-popup-framework-callback'
], function(_, sellingClass, popupFrameworkCallbak) {
    function hostUIService() {
      var hostUIService = _.assign({}, sellingClass, popupFrameworkCallbak);
      return hostUIService;
    }

    hostUIService.$inject = [];
    return hostUIService;
});
