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
  

  $jq.widget( "ui.autocomplete", autocomplete, {
    _create: function() {
      // Some browsers only repeat keydown events, not keypress events,
      // so we use the suppressKeyPress flag to determine if we've already
      // handled the keydown event. #7269
      // Unfortunately the code for & in keypress is the same as the up arrow,
      // so we use the suppressKeyPressRepeat flag to avoid handling keypress
      // events when we know the keydown event was used to modify the
      // search term. #7799
      var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
        nodeName = this.element[ 0 ].nodeName.toLowerCase(),
        isTextarea = nodeName === "textarea",
        isInput = nodeName === "input";
  
      this.isMultiLine =
        // Textareas are always multi-line
        isTextarea ? true :
        // Inputs are always single-line, even if inside a contentEditable element
        // IE also treats inputs as contentEditable
        isInput ? false :
        // All other element types are determined by whether or not they're contentEditable
        this.element.prop( "isContentEditable" );
  
      this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
      this.isNewMenu = true;

  
      this.element
        .addClass( "ui-autocomplete-input" )
        .attr( "autocomplete", "off" );
  
      this._on( this.element, {
        keydown: function( event ) {
          if ( this.element.prop( "readOnly" ) ) {
            suppressKeyPress = true;
            suppressInput = true;
            suppressKeyPressRepeat = true;
            return;
          }
  
          suppressKeyPress = false;
          suppressInput = false;
          suppressKeyPressRepeat = false;
          var keyCode = $jq.ui.keyCode;
          switch ( event.keyCode ) {
          case keyCode.PAGE_UP:
            suppressKeyPress = true;
            this._move( "previousPage", event );
            break;
          case keyCode.PAGE_DOWN:
            suppressKeyPress = true;
            this._move( "nextPage", event );
            break;
          case keyCode.UP:
            suppressKeyPress = true;
            this._keyEvent( "previous", event );
            break;
          case keyCode.DOWN:
            suppressKeyPress = true;
            break;
          case keyCode.ENTER:
            // when menu is open and has focus
            if ( this.menu.active ) {
              // #6055 - Opera still allows the keypress to occur
              // which causes forms to submit
              suppressKeyPress = true;
              event.preventDefault();
              this.menu.select( event );
            }
            break;
          case keyCode.TAB:
            suppressKeyPress = true;
            if ( this.menu.element.is( ":visible" ) ) {
              this._keyEvent( "next", event );
            }
            break;
          case keyCode.ESCAPE:
            if ( this.menu.element.is( ":visible" ) ) {
              if ( !this.isMultiLine ) {
                this._value( this.term );
              }
              this.close( event );
              // Different browsers have different default behavior for escape
              // Single press can mean undo or clear
              // Double press in IE means clear the whole form
              event.preventDefault();
            }
            break;
          default:
            suppressKeyPressRepeat = true;
            // search timeout should be triggered before the input value is changed
            this._searchTimeout( event );
            break;
          }
        },
        keypress: function( event ) {
          if ( suppressKeyPress ) {
            suppressKeyPress = false;
            if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
              event.preventDefault();
            }
            return;
          }
          if ( suppressKeyPressRepeat ) {
            return;
          }
  
          // replicate some key handlers to allow them to repeat in Firefox and Opera
          var keyCode = $jq.ui.keyCode;
          switch ( event.keyCode ) {
          case keyCode.PAGE_UP:
            this._move( "previousPage", event );
            break;
          case keyCode.PAGE_DOWN:
            this._move( "nextPage", event );
            break;
          case keyCode.UP:
            this._keyEvent( "previous", event );
            break;
          case keyCode.DOWN:
            this._keyEvent( "next", event );
            break;
          case keyCode.TAB:
            this._keyEvent( "next", event );
            break;
          }
          
        },
        input: function( event ) {
          if ( suppressInput ) {
            suppressInput = false;
            event.preventDefault();
            return;
          }
          this._searchTimeout( event );
        },
        focus: function() {
          this.selectedItem = null;
          this.previous = this._value();
        },
        blur: function( event ) {
          if ( this.cancelBlur ) {
            delete this.cancelBlur;
            return;
          }
  
          clearTimeout( this.searching );
          this.close( event );
          this._change( event );
        }
      });
  
      this._initSource();
      this.menu = $jq( "<ul>" )
        .addClass( "ui-autocomplete ui-front" )
        .appendTo( this._appendTo() )
        .menu({
          // disable ARIA support, the live region takes care of that
          role: null
        })
        .hide()
        .menu( "instance" );
  
      this._on( this.menu.element, {
        mousedown: function( event ) {
          // prevent moving focus out of the text field
          event.preventDefault();
  
          // IE doesn't prevent moving focus even with event.preventDefault()
          // so we set a flag to know when we should ignore the blur event
          this.cancelBlur = true;
          this._delay(function() {
            delete this.cancelBlur;
          });
  
          // clicking on the scrollbar causes focus to shift to the body
          // but we can't detect a mouseup or a click immediately afterward
          // so we have to track the next mousedown and close the menu if
          // the user clicks somewhere outside of the autocomplete
          var menuElement = this.menu.element[ 0 ];
          if ( !$jq( event.target ).closest( ".ui-menu-item" ).length ) {
            this._delay(function() {
              var that = this;
              this.document.one( "mousedown", function( event ) {
                if ( event.target !== that.element[ 0 ] &&
                    event.target !== menuElement &&
                    !$jq.contains( menuElement, event.target ) ) {
                  that.close();
                }
              });
            });
          }
        },
        menufocus: function( event, ui ) {
          var label, item;
          // support: Firefox
          // Prevent accidental activation of menu items in Firefox (#7024 #9118)
          if ( this.isNewMenu ) {
            this.isNewMenu = false;
            if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
              this.menu.blur();
  
              this.document.one( "mousemove", function() {
                $jq( event.target ).trigger( event.originalEvent );
              });
  
              return;
            }
          }
  
          item = ui.item.data( "ui-autocomplete-item" );
          if ( false !== this._trigger( "focus", event, { item: item } ) ) {
            // use value to match what will end up in the input, if it was a key event
            if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
              this._value( item.value );
            }
          }
  
          // Announce the value in the liveRegion
          label = ui.item.attr( "aria-label" ) || item.value;
          if ( label && $jq.trim( label ).length ) {
            this.liveRegion.children().hide();
            $jq( "<div>" ).text( label ).appendTo( this.liveRegion );
          }
        },
        menuselect: function( event, ui ) {
          var item = ui.item.data( "ui-autocomplete-item" ),
            previous = this.previous;
  
          // only trigger when focus was lost (click on menu)
          if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
            this.element.focus();
            this.previous = previous;
            // #6109 - IE triggers two focus events and the second
            // is asynchronous, so we need to reset the previous
            // term synchronously and asynchronously :-(
            this._delay(function() {
              this.previous = previous;
              this.selectedItem = item;
            });
          }
  
          if ( false !== this._trigger( "select", event, { item: item } ) ) {
            this._value( item.value );
          }
          // reset the term after the select event
          // this allows custom select handling to work properly
          this.term = this._value();
  
          this.close( event );
          this.selectedItem = item;
        }
      });
  
      this.liveRegion = $jq( "<span>", {
          role: "status",
          "aria-live": "assertive",
          "aria-relevant": "additions"
        })
        .addClass( "ui-helper-hidden-accessible" )
        .appendTo( this.document[ 0 ].body );
  
      // turning off autocomplete prevents the browser from remembering the
      // value when navigating through history, so we re-enable autocomplete
      // if the page is unloaded before the widget is destroyed. #7790
      this._on( this.window, {
        beforeunload: function() {
          this.element.removeAttr( "autocomplete" );
        }
      });
    },
  })

   function jquiAutocomplete (hostProxyService) {
     return {
       restrict: 'A',
       scope: {
         bsUpdateLocation: '&',
         bsLocationIndex: '@'
       },
       link: function($scope, $element) {
         console.log('the other element is', $element)
         $jq($element
           .bind( 'keydown', function( event ) {
            
           }))
          .autocomplete({
            minLength: 0,
            source: function(request, response) {
              // get the locations codes
              hostProxyService
               .getFromAirports(request.term, function(resp) {
                  resp = resp.map(function(arr) {
                   return {
                     locationName: arr[0],
                     locationCode: arr[1],
                     locationType: arr[2]
                   };
                  });
                  response(resp);
              });
            },
           focus: function() {
             // prevent value inserted on focus
             return false;
           },
           select: function( event, ui ) {
             $scope.bsUpdateLocation()({
               locationCode: ui.item.locationCode,
               locationType: ui.item.locationType,
               locationName: ui.item.locationName
             }, $scope.bsLocationIndex);
             $element.val( ui.item.locationName );
             $element.trigger('change');
             return false;
           },
           search: function( /*event, ui*/ ) {
             if(this.value.length === 0){
               $scope.bsUpdateLocation()({
                 locationCode: '',
                 locationType: '',
                 locationName: ''
                }, $scope.bsLocationIndex);
               $element.val( '' );
               $element.trigger('change');
             }
           },
          }).autocomplete( 'instance' )
           ._renderItem = function( ul, item ) {
             return $jq( '<li role="presentation" aria-label="'+ item.locationName +'">' )
               .append( '<span>' + item.locationName + '</span>' )
               .appendTo( ul );
           };
       }
     };
   }

  jquiAutocomplete.$inject = ['hostProxyService'];

  return jquiAutocomplete;
});
