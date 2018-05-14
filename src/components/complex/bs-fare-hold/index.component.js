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
            textDescription: scrapHelper.getDescriptionText(),
            linkDescription: scrapHelper.getDescriptionNote(),
            priceOptions: scrapHelper.getFareHoldOffers(),
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
                    <div class="fare-hold-content-row" tabindex=0>
                        <img src="//@@HOST/app/modules/bsmart-cm-ibe/assets/images/fare-hold-logo.png"
                         alt="Fare Hold">
                    </div>
                    <div class="fare-hold-content-row"> 
                        <p class="fare-hold-description-text" tabindex=0>
                            {{$ctrl.fareHold.textDescription}}
                        </p>
                        <p class="fare-hold-description-note" 
                            data-ng-bind-html="$ctrl.fareHold.linkDescription | sanitize">                       
                        </p>
                    </div>
                <div class="fare-hold-content-row">                          
                        <button class="btn btn-default" 
                            aria-selected="{{option.checked}}"
                            data-ng-class="{'selected': option.checked == true}"
                            data-ng-repeat="option in $ctrl.fareHold.priceOptions"
                            data-ng-click="option.changeStatus(option)"
                            > 
                            <span class="fare-hold-duration">{{option.duration}}</span>
                            <span class="fare-hold-price">
                                <span class="fare-hold-currency-prefix" ng-if="option.currency !=''">{{option.}}</span>
                                {{option.price}}
                            </span>
                        </button>
                                    
                    </div>                    
            </div>
        </div>
        `
    }
})