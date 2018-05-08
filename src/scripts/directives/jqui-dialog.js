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
    var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    var firstTabStop = null, lastTabStop = null, focusableElements = []
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
            closeOnEscape: false,
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

              // Find all focusable children              
              focusableElements = $(element).find(focusableElementsString);
              // Convert NodeList to Array
              focusableElements = Array.prototype.slice.call(focusableElements);

              firstTabStop = focusableElements[0];
              lastTabStop = focusableElements[focusableElements.length - 1];
              // Focus first child
              if(firstTabStop && firstTabStop !== 'undefined')firstTabStop.focus();
            },
            close: function(){
              // if($scope.bsOpenDialog === 'true')
              //   $scope.bsOpenDialog = 'false'
              if(typeof $scope.bsLastActive == 'undefined' || $scope.bsLastActive.length == 0)
                return;                             
              var lastAtive = document.getElementById($scope.bsLastActive)
              lastAtive.focus()
              document.removeEventListener("keydown", trapTabKey, true)
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

          $element.dialog(dialogOptions)

          let trapTabKey = evt => {
              //escape key
            if(evt.keyCode == 27){
              $element.find(".close").click()
            }
             // Check for TAB key press
            if (evt.keyCode === 9) {
              // SHIFT + TAB
              if (evt.shiftKey) {
                if (document.activeElement === firstTabStop) {
                  evt.preventDefault();
                  lastTabStop.focus();
                }
              // TAB
              } else {
                if (document.activeElement === lastTabStop) {
                  evt.preventDefault();
                  firstTabStop.focus();
                }
              }
            }
            evt.stopPropagation();
          }

          document.addEventListener("keydown", trapTabKey, true)
        }
     };
   }

  jquiDialog.$inject = ['$timeout'];

  return jquiDialog;
});
