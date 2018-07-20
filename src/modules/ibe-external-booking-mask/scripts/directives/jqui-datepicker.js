/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([
  'jquery',
  '../../../../lib/jquery-ui/datepicker',
  '../../../../lib/jquery-ui/maskedinput',
], function($jq, datepicker, maskedinput) {
  /**
   * Angular directive that create a wrapper for jQueryUI datepicker
   */
  
  function jquiDatepicker() {
    var DP_ID_STR = 'dp_';
    var DP_SELECTOR_INIT = 'input[data-dp-id="';
    var DP_SELECTOR_END = '"]';

    /**
     * Update datepicker siblings of selected datepicker
     * E.g
     *  if the current datepicker have date: 06/06/2016 the minimal date for
     * other datepicker after this is 06/06/2016
     *
     * @param {String} currentElement dp-id of current element
     * @param {String} totalAmount cantidad de total de datepickers
     * @param {String} selDate current date selected
     */
    var updateSiblingDatePickers = function(currentElement, totalAmount, selDate) {
      var currentInputId = currentElement;
      var currentIndex;

      if(angular.isDefined(currentInputId)) {
        currentIndex = parseInt(currentInputId.split('dp_')[1], 10);
        if(!isNaN(currentIndex)) {
          totalAmount = parseInt(totalAmount, 10);

          for(var i = currentIndex + 1; i < totalAmount; i++) {
            var $sibling = $jq(DP_SELECTOR_INIT + DP_ID_STR + i + DP_SELECTOR_END);
            if ($sibling.length > 0) {
              $sibling.datepicker('option', 'minDate', selDate );
              if ($sibling.val() !== '') {
                $sibling.datepicker('option', 'minDate', selDate );
                $sibling.change();
              }
            }
          }
        }
      }
    };

    var formatDateToString = function(stringDate){
      var dateObj = $jq.datepicker.parseDate('mm/dd/yy', stringDate);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var locale = 'en-US'
      return dateObj.toLocaleDateString(locale, options)
    }

    var addSelectedDateToLiveRegion = function(stringDate){
      var tmp = formatDateToString(stringDate)
      $jq("#wcag-datepicker-log").append('<p aria-live="assertive" aria-atomic="true" aria-relevant="additions text">' + tmp + '</p>')
    }

    var findLastSettedDateValue = function(currentElement, totalAmount) {
      var currentInputId = currentElement;
      var currentIndex;

      if(angular.isDefined(currentInputId)) {
        currentIndex = parseInt(currentInputId.split('dp_')[1], 10);
        totalAmount = parseInt(totalAmount, 10);
        if(!isNaN(currentIndex) && currentIndex === totalAmount - 1) {
          for(var i = totalAmount - 2; i >= 0; --i) {
            var $sibling = $jq(DP_SELECTOR_INIT + DP_ID_STR + i + DP_SELECTOR_END);
            if ($sibling.length > 0 && $sibling.val() !== '') {
              updateSiblingDatePickers( DP_ID_STR + i,
                totalAmount, $sibling.val());
            }
          }
        }
      }
    };

    return {
      restrict: 'EAC',
      require: 'ngModel',
      scope: {
        dpIsFromDate: '@?',
        dpSiblingDate: '@?',
        dpCurrentElement: '@?',
        dpTotalAmount: '@?'
      },
      link: function(scope, $element, attrs, ngModelCtrl) {
        var i = 0
        var options = {
          changeMonth: true,
          minDate: 0,
          beforeShow: function(input, instance) {
            var dpDiv = instance.dpDiv;
            $jq(input).parent().append(dpDiv);
            setTimeout(function () {
              dpDiv.css({
                  top: $jq(input).outerHeight(),
                  left: 0
              });
            }, 0);
            if(scope.dpIsFromDate === 'true' ||
            scope.dpIsFromDate === true ||
            scope.dpIsFromDate === 1){
              $jq(input).on('keydown', function(evt){ 
                if(evt.keyCode === 9 && evt.shiftKey == false){
                    evt.preventDefault();
                    $jq(scope.dpSiblingDate).focus() 
                }                    
              })
            }
            //adding close on escape key
            $jq(input).on('keydown', function(evt){
              //closing on scape
              if(evt.keyCode == 27){
                $jq($element).datepicker('hide')
              }
              if(evt.keyCode === 13){
                i++
                if(i == 2){
                 
                
                }//$(input).datepicker.trigger('select')
              }
            });
            $jq(input).blur();
            $jq(input).on('focus', function(){
              //$jq(input).trigger('blur');
            });
          }
        };
        // create options for select a Date Range
        if (angular.isDefined(scope.dpSiblingDate)) {
          if(angular.isDefined(scope.dpSiblingDate) &&
            (scope.dpIsFromDate === 'true' ||
            scope.dpIsFromDate === true ||
            scope.dpIsFromDate === 1)) {
            $jq(scope.dpSiblingDate).datepicker('option', 'minDate', 0);
          }

          options.beforeShowDay = function(date) {
            if(angular.isDefined(scope.dpSiblingDate)) {
              var siblingDate = $jq(scope.dpSiblingDate).datepicker('getDate');
              var sdYear, sdDate, sdMonth, aboveDate = null, belowDate = null;
              if(siblingDate !== null && siblingDate.getFullYear) {
                sdYear = siblingDate.getFullYear();
                sdMonth = siblingDate.getMonth();
                sdDate = siblingDate.getDate();

                if(sdYear === date.getFullYear() &&
                  sdMonth === date.getMonth() && sdDate === date.getDate()) {
                  return [true, 'ui-datepicker-current-day', ''];
                }

                var currentDate = $jq(this).datepicker('getDate');
                if(['true', true, 1].indexOf(scope.dpIsFromDate) >= 0) {
                  aboveDate = siblingDate;
                  belowDate = currentDate;
                } else {
                  aboveDate = currentDate;
                  belowDate = siblingDate;
                }

                if(aboveDate && belowDate) {
                  var dateTime = date.getTime();
                  if(currentDate &&
                    (belowDate.getTime() < dateTime && aboveDate.getTime() > dateTime)) {
                    return [true, 'ui-datepicker-middle-days', ''];
                  }
                }
              }
            }
            return [true, '', ''];
          };

          options.onClose = function( selectedDate, dpObject ) {
            console.log("closed date picker", selectedDate)
            if(angular.isDefined(scope.dpSiblingDate) &&
              (scope.dpIsFromDate === 'true' ||
              scope.dpIsFromDate === true ||
              scope.dpIsFromDate === 1)) {
              var now = new Date();
              var selDate = $jq.datepicker.parseDate('mm/dd/yy', selectedDate);
              if(!selDate) {
                $jq($element).datepicker('option', 'minDate', 0 );
                return;
              }
              selDate.setHours(23);
              selDate.setMinutes(59);
              selDate.setSeconds(59);
              if (selDate && selDate.getTime() >= now.getTime()) {
                $jq(scope.dpSiblingDate).datepicker('option',
                  'minDate', selectedDate );
              } else {
                dpObject.input.val('');
                dpObject.input.change();
                $jq(scope.dpSiblingDate).datepicker('option',
                  'minDate', now );
              }
            } else {
              $jq(scope.dpSiblingDate).datepicker('option',
                'maxDate', selectedDate );
            }

            updateSiblingDatePickers(scope.dpCurrentElement,
              scope.dpTotalAmount, selectedDate);
          };
        } else {
          options.minDate = new Date();
        }

        options.onSelect = function(selectedDate , dpObject){         
          addSelectedDateToLiveRegion(selectedDate)
         
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(selectedDate);
          });
          updateSiblingDatePickers(scope.dpCurrentElement,
            scope.dpTotalAmount, selectedDate);
          dpObject.input.focus()
          dpObject.input.datepicker('hide')
        };

        // setting datepicker
        $jq($element).datepicker(options);
        findLastSettedDateValue(scope.dpCurrentElement, scope.dpTotalAmount - 1);
      }
    };
  }

  jquiDatepicker.$inject = [];

  return jquiDatepicker;
});
