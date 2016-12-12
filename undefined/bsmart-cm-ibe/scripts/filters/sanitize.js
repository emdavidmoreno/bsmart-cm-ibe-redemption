/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([], function() {
  function sanitize($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }

  sanitize.$inject = ['$sce'];

  return sanitize;
});
