/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([
  'jquery',
    '../../lib/jquery-ui/dialog',
], function($) {
  /**
   * Angular directive that create a wrapper for jQueryUI dialog
   */
   function jquiDialog ($timeout) {
     return {
       restrict: 'A',
       scope: {
         bsOpenDialog: '@',
         bsCloseFromInner: '=',
         bsLastActive: "@"

       },
       replace:false,
       transclude: true,  // transclusion allows for the dialog
                          // contents to use angular {{}}
       template: '<div ng-transclude></div>',
        link: function($scope, element, attrs) {
          var $element = $(element);
          var dialogOptions = {
            autoOpen: false,
            modal: true,
            width: attrs.width || 350,
            height: attrs.height || 200,
            draggable: false,
            resizable: false,           
            open: function() {
              $('.ui-widget-overlay').bind('click', function() {
                $timeout(function() {
                  $scope.bsCloseFromInner = false;
                }, 0);
                $element.dialog('close');
              });
            },
            close: function(){
              if($scope.bsOpenDialog === 'true')
                $scope.bsOpenDialog = 'false'
              if(typeof $scope.bsLastActive == 'undefined' || $scope.bsLastActive.length == 0)
                return;                             
              var lastAtive = document.getElementById($scope.bsLastActive)
              lastAtive.focus()
            }
          };
          // This works when observing an interpolated attribute
          // e.g {{dialogOpen}}.  In this case the val is always a string and so
          // must be compared with the string 'true' and not a boolean
          // using open: '@' and open="{{dialogOpen}}"
          attrs.$observe('bsOpenDialog', function(val) {
            
            if (val === 'true') {
              $element.dialog('open');
            }
            else {
              $element.dialog('close');           
              
            }
          });

          $element.dialog(dialogOptions);
        }
     };
   }

  jquiDialog.$inject = ['$timeout'];

  return jquiDialog;
});
