define([
    'jquery',
    './helpers/scrapHelper',
], function($, scrapHelper){
    'use strict'

    let bsFareHoldController = function($scope, $timeout){

        var ctrl = this

        $scope.$on("app:language-changed", function(){
     
            syncUI();
          });
    
          //-------------------------------------------------------
          // Sync text with new language
          //-------------------------------------------------------
    
          function syncUI(){
            $timeout(function() {
              console.log("changing language")              
            }, 500)
          }
    
        /**
         * Init component
         */
        ctrl.$onInit = function() {
           syncUI();
          };

        var fareHold = {
            textDescription: scrapHelper.getDescriptionImg(),
            linkDescription: scrapHelper.getDescriptionNote(),
            priceOptions: scrapHelper.getFareHoldOffers(),
            bannerImg: scrapHelper.getBannerImg(),
            existFareHold: scrapHelper.existFareHold()

        }       

        ctrl.fareHold = fareHold

        ctrl.changeOption = function(option){
            scrapHelper.toggleCheckBox(option)
        }

    }
    bsFareHoldController.$inject = ['$scope', '$timeout'];

    return {
        bindings: {
            states: "<?"
        },
        controller: bsFareHoldController,
        template : `
        <div class="fare-hold-container" data-ng-if="$ctrl.fareHold.existFareHold == true">
            <section tabindex=0>
                <h3>Flight Offers</h3>
            </section>
            <div class="fare-hold-content text-center">
                    <div class="fare-hold-content-row header" tabindex=0 
                    data-ng-bind-html="$ctrl.fareHold.bannerImg | sanitize">                        
                    </div>
                    <div class="fare-hold-content-row description"  
                    data-ng-bind-html="$ctrl.fareHold.textDescription | sanitize">
                    </div>
                <div class="fare-hold-content-row options">                          
                        <button class="btn btn-default" 
                            aria-selected="{{option.checked}}"
                            data-ng-class="{'selected': option.checked == true}"
                            data-ng-repeat="option in $ctrl.fareHold.priceOptions"
                            data-ng-click="option.changeStatus(option)"
                            > 
                            <span class="fare-hold-duration">{{option.duration}}</span>
                            <span class="fare-hold-price">
                                {{option.price}}
                            </span>
                        </button>
                                    
                    </div>                    
            </div>
        </div>
        `
    }
})