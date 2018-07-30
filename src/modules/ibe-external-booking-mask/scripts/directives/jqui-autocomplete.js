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
       },
       link: function($scope, $element) {
        var cbSource = [];
        hostProxyService
          .getFromAirports("", function(resp) {
            cbSource = resp.map(function(arr) {
              return {
                locationName: arr[0],
                locationCode: arr[1],
                locationType: arr[2]
              };
            });
            //response(resp);
        });
        $jq.widget( "custom.combobox", {
          _create: function() {
            this.wrapper = $( "<span>" )
              .addClass( "custom-combobox" )
              .insertAfter( this.element );
     
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
          },
     
          _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
                value = selected.val() ? selected.text() : "";
     
            this.input = $jq( "<input>" )
              .appendTo( this.wrapper )
              .val( value )
              .attr( "title", "" )
              .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
              .autocomplete({
                delay: 0,
                minLength: 3,
                select: function( event, ui ) {
                  $scope.bsUpdateLocation()({
                    locationCode: ui.item.locationCode,
                    locationType: ui.item.locationType,
                    locationName: ui.item.locationName
                  }, $scope.bsLocationIndex);
                  $jq(event.target).val( ui.item.locationName );
                  $jq(event.target).trigger('change');
                //   var liveRegion = $jq($jq($element).autocomplete('widget')).next()
                //  $jq(liveRegion).append(`<div style="display:none"> ${ui.item.locationName} selected</div>`)
                //    // if(event.keyCode != $jq.ui.keyCode.TAB){
                //    //  focusNextElement($element)
                //    // }
                  return false;
                },
                source: function(request, response) {
                  // get the locations codes
                  hostProxyService
                  .getFromAirports(request.term, function(resp) {
                      resp = resp.map(function(arr) {
                      return {
                        label: arr[0],
                        value: arr[0],
                        locationName: arr[0],
                        locationCode: arr[1],
                        locationType: arr[2],
                        option:{
                          locationName: arr[0],
                          locationCode: arr[1],
                          locationType: arr[2]
                        } 
                      };
                      });
                      response(resp);
                  });
                },
              })
              // .tooltip({
              //   classes: {
              //     "ui-tooltip": "ui-state-highlight"
              //   }
              // });
     
            this._on( this.input, {
              autocompleteselect: function( event, ui ) {
                ui.item.option.selected = true;
                this._trigger( "select", event, {
                  item: ui.item.option
                });
              },
     
              autocompletechange: "_removeIfInvalid"
            });
          },
     
          _createShowAllButton: function() {
            var input = this.input,
              wasOpen = false;
     
            $jq( "<a>" )
              .attr( "tabIndex", -1 )
              .attr( "title", "Show All Items" )
              //.tooltip()
              .appendTo( this.wrapper )
              // .button({
              //   icons: {
              //     primary: "ui-icon-triangle-1-s"
              //   },
              //   text: false
              // })
              .removeClass( "ui-corner-all" )
              .addClass( "custom-combobox-toggle ui-corner-right" )
              .on( "mousedown", function() {
                wasOpen = input.autocomplete( "widget" ).is( ":visible" );
              })
              .on( "click", function() {
                input.trigger( "focus" );
     
                // Close if already visible
                if ( wasOpen ) {
                  return;
                }
     
                // Pass empty string as value to search for, displaying all results
                input.autocomplete( "search", "" );
              });
          },
     
          _source: function( request, response ) {
              hostProxyService
               .getFromAirports(request.term, function(resp) {
                  resp = resp.map(function(arr) {
                   return {
                    label: arr[0],
                    value: arr[0],
                    option:{
                      locationName: arr[0],
                      locationCode: arr[1],
                      locationType: arr[2]
                    } 
                   };
                  });
                  response(resp);
              });

            // var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            // response( this.element.children( "option" ).map(function() {
            //   var text = $( this ).text();
            //   if ( this.value && ( !request.term || matcher.test(text) ) )
            //     return {
            //       label: text,
            //       value: text,
            //       option: this
            //     };
            // }) );
          },
     
          _removeIfInvalid: function( event, ui ) {
     
            // Selected an item, nothing to do
            if ( ui.item ) {
              return;
            }
     
            // Search for a match (case-insensitive)
            var value = this.input.val(),
              valueLowerCase = value.toLowerCase(),
              valid = false;
            this.element.children( "option" ).each(function() {
              if ( $jq( this ).text().toLowerCase() === valueLowerCase ) {
                this.selected = valid = true;
                return false;
              }
            });
     
            // Found a match, nothing to do
            if ( valid ) {
              return;
            }
     
            // Remove invalid value
            this.input
              .val( "" )
              .attr( "title", value + " didn't match any item" )
              //.tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
              //this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
          },
     
          _destroy: function() {
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
