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
  /**
   * Autocomplete extension widget to refactor methods
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
         $jq($element
           .bind( 'keydown', function( event ) {
             if (event.keyCode === $jq.ui.keyCode.TAB &&
               $jq(this).autocomplete('instance').menu.active) {
                event.preventDefault();
             }
           }))
          .autocomplete({
            minLength: 3,
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
           focus: function(event, ui) {
             // prevent value inserted on focus
             $scope.bsUpdateLocation()({
              locationCode: ui.item.locationCode,
              locationType: ui.item.locationType,
              locationName: ui.item.locationName
            }, $scope.bsLocationIndex);
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
             focusNextElement($element)
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
       }
     };
   }

  jquiAutocomplete.$inject = ['hostProxyService'];

  return jquiAutocomplete;
});
