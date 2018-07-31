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
         bsLocationIndex: '@'
       },
       link: function($scope, $element) {
         var parentNode = $element[0].parentNode,
              liveRegion = 'undefined'
         $jq($element
           .bind( 'keydown', function( event ) {
             if (event.keyCode === $jq.ui.keyCode.TAB &&
               $jq(this).autocomplete('instance').menu.active) {
               event.preventDefault();
             }
           }))
          .autocomplete({
            minLength: 3,
            appendTo: parentNode,
            messages: {
              noResults: "No search results.",
              results: function( amount ) {
                return "List expanded with " + amount + ( amount > 1 ? " results" : " result" ) +
                  " available.";
              }
            },
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
           focus: function(event, ui ) {
              $element.val( ui.item.locationName );
              $element.trigger('change'); 
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
              liveRegion.children().hide();
					    $jq( "<div>" ).text( ui.item.locationName + " selected" ).appendTo( liveRegion );            
              // if(event.keyCode != $jq.ui.keyCode.TAB){
              //   focusNextElement($element)
              // }
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
             return $jq( '<li>' )
               .append( '<span>' + item.locationName + '</span>' )
               .appendTo( ul );
           };
          $jq($element).autocomplete('instance')
          ._renderMenu = function( ul, items ) {
            var that = this;
            liveRegion = this.liveRegion || "undefined";
            $.each( items, function( index, item ) {
              that._renderItemData( ul, item );
            });
            $jq(ul).attr('role', 'listbox')
          }

       }
     };
   }

  jquiAutocomplete.$inject = ['hostProxyService'];

  return jquiAutocomplete;
});
