define([
    'jquery',
    './helpers/scrapHelper',
], function($, scrapHelper){
    'use strict'

    let bsFareHoldController = function($scope, $timeout, $interval){

        var ctrl = this

        var fareHold = {}

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

        

    }
    bsFareHoldController.$inject = ['$scope', '$timeout', '$interval'];

    return {
        bindings: {
            states: "<?",
            textDescription: "<",
            linkDescription: "<",
            priceOptions: "<",
            bannerImg: "<",
            existFareHold: "<"
        },
        controller: bsFareHoldController,
        template : `
        <div class="fare-hold-container" >
            <section tabindex=0>
                <h3>Flight Offers</h3> 
            </section>
            <div class="fare-hold-content text-center">
                    <div class="fare-hold-content-row blue-bg" tabindex=0 
                    data-ng-bind-html="$ctrl.bannerImg | sanitize">                        
                    </div>
                    <div class="fare-hold-content-row description blue-bg"  
                    data-ng-bind-html="$ctrl.textDescription | sanitize">
                    </div>
                <div class="fare-hold-content-row options">                          
                        <button class="btn btn-default" 
                            aria-selected="{{option.checked}}"
                            data-ng-class="{'selected': option.checked == true}"
                            data-ng-repeat="option in $ctrl.priceOptions"
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