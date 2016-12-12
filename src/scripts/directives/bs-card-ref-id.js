/* jshint browser:true */
/* jshint -W003*/
'use strict';
define(['jquery', 'angular'], function($) {
  /**
   * Angular directive
   */
   function bsCardRefId ($sce) {
     return {
       restrict: 'EA',
       scope: { },
       replace: true,
       template: '<section class="m-card m-card--muted">' +
          '<header class="title">' +
            '<h4 class="title-text title-text--normal">' +
              '<i class="title-icon"> </i>' +
              '{{refHead}}' +
            '</h4>' +
          '</header>' +
          '<div class="content">' +
             '<strong class="text-size--medium"> {{refBody}} </strong>' +
          '</div>' +
        '</section>',
        link: function(scope, element) {
          // extract Reference ID text and split by endline
          // ["", "   Precisa de ajuda? ", "    Código de referência: A012693383"]
          var blockArray = $('.enterChat .bodyBlock h3').text().split('\n');
          // It get the last value of the array
          var textRefID = blockArray[blockArray.length - 1];
          // Check if the text have a valid value
          if (textRefID) {
            var textArray = textRefID.split(':').map(function(text) {
              return text.trim();
            });
            scope.refHead = blockArray[1].trim();
            scope.refBody = textArray[0] + ': ' + textArray[1];
          }
        }
     };
   }

   bsCardRefId.$inject = [];

   return bsCardRefId;
});
