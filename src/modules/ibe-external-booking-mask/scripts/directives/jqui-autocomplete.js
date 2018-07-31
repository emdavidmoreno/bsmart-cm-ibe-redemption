/* jshint browser:true */
/* jshint -W003*/
'use strict';
define([
  'jquery',
    '../../../../lib/jquery-ui/autocomplete'
], function($jq, autocomplete) {
  /**
   * Angular directive that create a wrapper for jQueryUI autocomplete
   */

   var focusNextElement = (currentElement)=>{
     var allElements = $jq('input'), pos = -1     
     allElements.each(function(index,item){
       if(item === currentElement[0]){
          pos = index
       }
     })
     if(pos >= 0 && (pos + 1) < allElements.length){
       allElements[pos+1].focus()
     }

   }
  
   function jquiAutocomplete (hostProxyService) {
     return {
       restrict: 'A',
       scope: {
         bsUpdateLocation: '&',
         bsLocationIndex: '@',
         bsPlaceholder: '@',
         bsAriaLabel: '@'
       },
       link: function($scope, $element) {
         var $input = $jq('<input>');
         var $select = $jq($element);

        
        $jq.widget("custom.combobox", {
          // this options could be overwrite for an specif airline without
          // touch this code
          options: {
              delay: 0,
              minLength: 0,
              source: $jq.proxy(this, "_source"),
              appendTo: this.wrapper,
              addAriaLabelledBy: null,
              addAriaLabel: null,
              messages: {
                noResults: "No search results.",
                results: function( amount ) {
                  return "Combobox expanded with " + amount + ( amount > 1 ? " results" : " result" ) +
                    " available.";
                }
              },
              focus: function (event, ui) {
                  // var menu = $jq(this).data("uiAutocomplete").menu.element,
                  //         focused = menu.find("li:has(a.ui-state-focus)");
                  // menu.find("li.ui-state-focus").removeClass('ui-state-focus');
                  // focused.addClass('ui-state-focus');
                 
              },
              createShowAllButton: 0,
          },
          _create: function () {
              this.wrapper = $jq("<span>")
                      .addClass("custom-combobox")
                      .insertAfter(this.element);
  
              this.options.appendTo = this.wrapper;
              this.element.hide();
              this._createAutocomplete();
  
              if (this.options.createShowAllButton) {
                  this._createShowAllButton();
              }
  
              // Add processing placeholder option
              this.input.attr("placeholder", $scope.bsPlaceholder);
          },
          _createAutocomplete: function () {
              var selected = this.element.children(':selected');
              var value = selected.val() ? selected.text() : '';
  
              this.options.source = $jq.proxy(this, "_source");
              this.options.select = function( event, ui ) { 
                $scope.bsUpdateLocation()({
                  locationCode: ui.item.locationCode,
                  locationType: ui.item.locationType,
                  locationName: ui.item.locationName
                }, $scope.bsLocationIndex); 
                $input.val( ui.item.locationName );
                if(!ui.item.option.bubblig){
                  ui.item.option.bubblig = true
                }else{
                  
                }
                $input.trigger('change');

                if(event.keyCode != $jq.ui.keyCode.TAB){
                  focusNextElement($input)
                }  
                return false;
              }
  
              // we need to merge the options parameters with
              // the default ones
              // this behavior allow that every airline can customize his own
              // autocomplete parameters
  
              // autocompleteDefaultOptions = $jq.extend(autocompleteDefaultOptions, options);
              this.input = $input
                      .appendTo(this.wrapper)
                      .val(value)
                      .attr("title", "")
                      .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                      .autocomplete(this.options);
                      if(this.options.addAriaLabelledBy){
                        this.input.attr("aria-labelledby", this.options.addAriaLabelledBy);
                      };
                      if(this.options.addAriaLabel){
                        this.input.attr("aria-label", this.options.addAriaLabel);
                      };
              this.wrapper.find("ul").attr("tabIndex", '-1');

              this.input.autocomplete('instance')
              ._renderItem = function( ul, item ) {
                return $jq( '<li>' )
                  .append( '<span>' + item.locationName + '</span>' )
                  .appendTo( ul );
              };
  
              this._on(this.input, {
                  autocompleteselect: function (event, ui) {
                      ui.item.option.selected = true;
                      ui.item.option.bubblig = false;
                      //.ui-state-focus   
                      
                      this._trigger("select", event, {
                          item: ui.item
                      });
                  },
                  autocompletechange: "_removeIfInvalid"
              });
          },
          _createShowAllButton: function () {
              var input = this.input,
                  wasOpen = false;
  
              $jq("<a>")
                      .attr("tabIndex", -1)
                      .attr("title", "Show All Items")
                      // .tooltip()
                      .appendTo(this.wrapper)
                      .button({
                          icons: {
                              primary: "ui-icon-triangle-1-s"
                          },
                          text: false
                      })
                      .removeClass("ui-corner-all")
                      .addClass("custom-combobox-toggle ui-corner-right")
                      .mousedown(function () {
                          wasOpen = input.autocomplete("widget").is(":visible");
                      })
                      .click(function () {
                          input.focus();
  
                          // Close if already visible
                          if (wasOpen) {
                              input.blur();
                              return;
                          }
  
                          // Pass empty string as value to search for, displaying all results
                          input.autocomplete("search", "");
                      });
          },
          _source: function (request, response) {
            hostProxyService
            .getFromAirports(request.term, function(resp) {
               resp = resp.map(function(arr) {
                return {
                  locationName: arr[0],
                  locationCode: arr[1],
                  locationType: arr[2],
                  option:{}
                };
               });
               response(resp);
           });
          },
          _removeIfInvalid: function (event, ui) {
  
              // Selected an item, nothing to do
              if (ui.item) {
                  return;
              }
  
              // Search for a match (case-insensitive)
              var value = this.input.val(),
                      valueLowerCase = value.toLowerCase(),
                      valid = false;
              this.element.children("option").each(function () {
                  if ($jq(this).text().toLowerCase() === valueLowerCase) {
                      this.selected = valid = true;
                      return false;
                  }
              });
  
              // Found a match, nothing to do
              if (valid) {
                  return;
              }
  
              // Remove invalid value
              this.input
                      .val("")
                      .attr("title", value + " didn't match any item");
                      //.tooltip("open");
              this.element.val("");
              this._delay(function () {
                 // this.input.tooltip("close").attr("title", "");
              }, 2500);
              try {
                  this.input.autocomplete( "instance" ).term = "";
              }
              catch(err) {
              }
          },
          _destroy: function () {
              this.wrapper.remove();
              this.element.show();
          }
      });
        

        $jq($element).combobox()












         // Adding some Accessibility attributes
        //  $jq($element).attr('role', 'combobox')
        //  .attr('aria-autocomplete', 'false')
        //  .attr('aria-haspopup', "true")
        //  .attr("aria-expanded", "false")
        //  .attr('aria-activedescendant',"")
        //  $jq($element
        //     .bind("keydown", function(event){
            
        //    }))
        //   .autocomplete({
        //     minLength: 3,
        //     autoFocus: true,
        //     close: function(event, ui){
        //       $jq($element).attr("aria-expanded", "false")
        //     },
        //     open: function(event, ui){
        //       $jq($element).attr("aria-expanded", "true")

        //     },
        //     messages: {
        //       noResults: "No search results.",
        //       results: function( amount ) {
        //         return "Combobox expanded with " + amount + ( amount > 1 ? " results" : " result" ) +
        //           " available.";
        //       }
        //     },
        //     focus: function(event, ui){
        //       setAriaSelectedValue($element,$jq($element).autocomplete('widget'), ui.item.locationName)
        //       $element.val( ui.item.locationName );
        //       $element.trigger('change');
        //       return false;
        //     },
        //     source: function(request, response) {
        //       // get the locations codes
        //       hostProxyService
        //        .getFromAirports(request.term, function(resp) {
        //           resp = resp.map(function(arr) {
        //            return {
        //              locationName: arr[0],
        //              locationCode: arr[1],
        //              locationType: arr[2]
        //            };
        //           });
        //           response(resp);
        //       });
        //     },
        //    select: function( event, ui ) {
        //      $scope.bsUpdateLocation()({
        //        locationCode: ui.item.locationCode,
        //        locationType: ui.item.locationType,
        //        locationName: ui.item.locationName
        //      }, $scope.bsLocationIndex);
        //      $element.val( ui.item.locationName );
        //      $element.trigger('change');
        //      var liveRegion = $jq($jq($element).autocomplete('widget')).next()
        //     $jq(liveRegion).append(`<div style="display:none"> ${ui.item.locationName} selected</div>`)
        //       // if(event.keyCode != $jq.ui.keyCode.TAB){
        //       //  focusNextElement($element)
        //       // }
        //      return false;
        //    },
        //    search: function( /*event, ui*/ ) {
        //      if(this.value.length === 0){
        //        $scope.bsUpdateLocation()({
        //          locationCode: '',
        //          locationType: '',
        //          locationName: ''
        //         }, $scope.bsLocationIndex);
        //        $element.val( '' );
        //        $element.trigger('change');              
        //      }
        //    },
        //   }).autocomplete( 'instance' )
        //    ._renderItem = function( ul, item ) {
        //      return $jq( '<li role="option" aria-selected="false" aria-label="'+ item.locationName +'">' )
        //        .append( '<span>' + item.locationName + '</span>' )
        //        .appendTo( ul );
        //    };
       }
     };
   }

   var setAriaSelectedValue = function(input, $optionList, selectedText){
    $optionList.find('li').each(function(index, listItem){
      var text = $(listItem).attr('aria-label');
      $(listItem).attr('aria-selected', 'true')
      if(!text.localeCompare(selectedText)){
       $(input).attr('aria-activedescendant',listItem.id)

      }else{
       $(listItem).attr('aria-selected', 'false');
      }
    })
   }

  jquiAutocomplete.$inject = ['hostProxyService'];

  return jquiAutocomplete;
});
