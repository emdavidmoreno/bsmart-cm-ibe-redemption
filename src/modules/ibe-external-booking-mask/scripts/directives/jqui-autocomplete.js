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
  
   function jquiAutocomplete (hostProxyService) {
     return {
       restrict: 'A',
       scope: {
         bsUpdateLocation: '&',
         bsLocationIndex: '@'
       },
       link: function($scope, $element) {
         // Adding some Accessibility attributes
         $jq($element).attr('role', 'combobox')
         .attr('aria-autocomplete', 'false')
         .attr('aria-haspopup', "true")
         .attr("aria-expanded", "false")
         .attr('aria-activedescendant',"")
         $jq($element
           .bind( 'keydown', function( event ) {
            
           }))
          .autocomplete({
            minLength: 3,
            autoFocus: true,
            close: function(event, ui){
              $jq($element).attr("aria-expanded", "false")
            },
            open: function(evnt, ui){
              $jq($element).attr("aria-expanded", "true")

            },
            messages: {
              noResults: "No search results.",
              results: function( amount ) {
                return "Combobox expanded with" + amount + ( amount > 1 ? " results" : " result" ) +
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
            setAriaSelectedValue($element,$jq($jq($element).autocomplete('widget')),
                                ui.item.locationName)
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
             var liveRegion = $jq($jq($element).autocomplete('widget')).next()
             $jq(liveRegion).append(`<div> ${ui.item.locationName} selected</div>`)
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
             return $jq( '<li role="option" aria-selected="false" aria-label="'+ item.locationName +'">' )
               .append( '<span>' + item.locationName + '</span>' )
               .appendTo( ul );
           };
       }
     };
   }

   var setAriaSelectedValue = function(input, $optionList, selectedText){
    $optionList.find('li').each(function(index, value){
      var text = $(value).attr('aria-label');
      if(!text.localeCompare(selectedText)){
       $(value).attr('aria-selected', 'true');
       $(input).attr('aria-activedescendant',value.id)

      }else{
       $(value).attr('aria-selected', 'false');
      }
    })
   }

  jquiAutocomplete.$inject = ['hostProxyService'];

  return jquiAutocomplete;
});
