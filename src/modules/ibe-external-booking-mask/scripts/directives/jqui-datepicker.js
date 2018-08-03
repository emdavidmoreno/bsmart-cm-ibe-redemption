/* jshint browser:true */
/* jshint -W003*/
'use strict'
define([
  'jquery',
  '../../../../lib/jquery-ui/datepicker',
], function($jq, datepicker) {
  /**
   * Angular directive that create a wrapper for jQueryUI datepicker
   *
   * @return {Object}
   */
  
  function jquiDatepicker() {
    let DP_ID_STR = 'dp_'
    let DP_SELECTOR_INIT = 'input[data-dp-id="'
    let DP_SELECTOR_END = '"]'

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
    let updateSiblingDatePickers =
      function(currentElement, totalAmount, selDate) {
        let currentInputId = currentElement
        let currentIndex

        if (angular.isDefined(currentInputId)) {
          currentIndex = parseInt(currentInputId.split('dp_')[1], 10)
          if (!isNaN(currentIndex)) {
            totalAmount = parseInt(totalAmount, 10)

            for (let i = currentIndex + 1; i < totalAmount; i++) {
              let $sibling =
                $jq(DP_SELECTOR_INIT + DP_ID_STR + i + DP_SELECTOR_END)
              if ($sibling.length > 0) {
                $sibling.datepicker('option', 'minDate', selDate )
                if ($sibling.val() !== '') {
                  $sibling.datepicker('option', 'minDate', selDate )
                  $sibling.change()
                }
              }
            }
          }
        }
      }

    let formatDateToString = function(stringDate) {
      let dateObj = $jq.datepicker.parseDate('mm/dd/yy', stringDate)
      let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
      let locale = 'en-US'
      return dateObj.toLocaleDateString(locale, options)
    }

    let addSelectedDateToLiveRegion = function(stringDate) {
      let tmp = formatDateToString(stringDate)
      $jq('#wcag-datepicker-log')
        .append('<p aria-live="assertive" aria-atomic="true" aria-relevant="additions text">' + tmp + '</p>')
    }

    let findLastSettedDateValue = function(currentElement, totalAmount) {
      let currentInputId = currentElement
      let currentIndex

      if (angular.isDefined(currentInputId)) {
        currentIndex = parseInt(currentInputId.split('dp_')[1], 10)
        totalAmount = parseInt(totalAmount, 10)
        if (!isNaN(currentIndex) && currentIndex === totalAmount - 1) {
          for (let i = totalAmount - 2; i >= 0; --i) {
            let $sibling =
              $jq(DP_SELECTOR_INIT + DP_ID_STR + i + DP_SELECTOR_END)
            if ($sibling.length > 0 && $sibling.val() !== '') {
              updateSiblingDatePickers( DP_ID_STR + i,
                totalAmount, $sibling.val())
            }
          }
        }
      }
    }

    return {
      restrict: 'EAC',
      require: 'ngModel',
      scope: {
        dpIsFromDate: '@?',
        dpSiblingDate: '@?',
        dpCurrentElement: '@?',
        dpTotalAmount: '@?',
      },
      link: function(scope, $element, attrs, ngModelCtrl) {
        
        ngModelCtrl.$formatters.push(modelValue=>{
          var $return = modelValue;
          return $return;
        });
        ngModelCtrl.$parsers.push(function(viewValue) {
          return viewValue;
        });
        
        ngModelCtrl.$validators.url = function(modelValue, viewValue){
          return true;
        }
              
        let options = {
          changeMonth: true,
          dateFormat: "mm/dd/yy",
          minDate: 0,
          beforeShow: function(input, instance) {
            let dpDiv = instance.dpDiv
            $jq(input).parent().append(dpDiv)
            setTimeout(function() {
              dpDiv.css({
                top: $jq(input).outerHeight(),
                left: 0,
              })
            }, 0)
            if (scope.dpIsFromDate === 'true' ||
            scope.dpIsFromDate === true ||
            scope.dpIsFromDate === 1) {
              $jq(input).on('keydown', function(evt) {
                if (evt.keyCode === 9 && evt.shiftKey == false) {
                  evt.preventDefault()
                  $jq(scope.dpSiblingDate).focus()
                }
              })
            }
            // adding close on escape key
            $jq(input).on('keydown', function(evt) {
              // closing on scape
              if (evt.keyCode == 27) {
                $jq($element).datepicker('hide')
              }
              if (evt.keyCode === 13) {
                // i++
                // if (i == 2) {
                // }// $(input).datepicker.trigger('select')
              }
            })
            $jq(input).blur()
            $jq(input).on('focus', function() {
              // $jq(input).trigger('blur');
            })
          },
        }
        
        // create options for select a Date Range
        if (angular.isDefined(scope.dpSiblingDate)) {
          if (angular.isDefined(scope.dpSiblingDate) &&
            (scope.dpIsFromDate === 'true' ||
            scope.dpIsFromDate === true ||
            scope.dpIsFromDate === 1)) {
            $jq(scope.dpSiblingDate).datepicker('option', 'minDate', 0)
          }

          options.beforeShowDay = function(date) {
            if (angular.isDefined(scope.dpSiblingDate)) {
              let siblingDate = $jq(scope.dpSiblingDate).datepicker('getDate')
              let sdYear
              let sdDate
              let sdMonth
              let aboveDate = null
              let belowDate = null
              if (siblingDate !== null && siblingDate.getFullYear) {
                sdYear = siblingDate.getFullYear()
                sdMonth = siblingDate.getMonth()
                sdDate = siblingDate.getDate()

                if (sdYear === date.getFullYear() &&
                  sdMonth === date.getMonth() && sdDate === date.getDate()) {
                  return [true, 'ui-datepicker-current-day', '']
                }

                let currentDate = $jq(this).datepicker('getDate')
                if (['true', true, 1].indexOf(scope.dpIsFromDate) >= 0) {
                  aboveDate = siblingDate
                  belowDate = currentDate
                } else {
                  aboveDate = currentDate
                  belowDate = siblingDate
                }

                if (aboveDate && belowDate) {
                  let dateTime = date.getTime()
                  if (currentDate &&
                    (belowDate.getTime() < dateTime &&
                      aboveDate.getTime() > dateTime)) {
                    return [true, 'ui-datepicker-middle-days', '']
                  }
                }
              }
            }
            return [true, '', '']
          }

          options.onClose = function( selectedDate, dpObject ) {
            console.log('closed date picker', selectedDate)
            if (angular.isDefined(scope.dpSiblingDate) &&
              (scope.dpIsFromDate === 'true' ||
              scope.dpIsFromDate === true ||
              scope.dpIsFromDate === 1)) {
              let now = new Date()
              let selDate = $jq.datepicker.parseDate('mm/dd/yy', selectedDate)
              if (!selDate) {
                $jq($element).datepicker('option', 'minDate', 0 )
                return
              }
              selDate.setHours(23)
              selDate.setMinutes(59)
              selDate.setSeconds(59)
              if (selDate && selDate.getTime() >= now.getTime()) {
                $jq(scope.dpSiblingDate).datepicker('option',
                  'minDate', selectedDate )
              } else {
                dpObject.input.val('')
                dpObject.input.change()
                $jq(scope.dpSiblingDate).datepicker('option',
                  'minDate', now )
              }
            } else {
              $jq(scope.dpSiblingDate).datepicker('option',
                'maxDate', selectedDate )
            }

            updateSiblingDatePickers(scope.dpCurrentElement,
              scope.dpTotalAmount, selectedDate)
          }
        } else {
          options.minDate = new Date()
        }

        options.onSelect = function(selectedDate, dpObject) {
          addSelectedDateToLiveRegion(selectedDate)

          scope.$apply(function() {
            ngModelCtrl.$setViewValue(selectedDate);
            ngModelCtrl.$render();
          })
          updateSiblingDatePickers(scope.dpCurrentElement,
            scope.dpTotalAmount, selectedDate)
          dpObject.input.focus()
          dpObject.input.datepicker('hide')
        }

        // setting datepicker
        $jq($element).datepicker(options)
        findLastSettedDateValue(scope.dpCurrentElement, scope.dpTotalAmount - 1)
        
      },
    }
  }

  jquiDatepicker.$inject = []

  return jquiDatepicker
})
