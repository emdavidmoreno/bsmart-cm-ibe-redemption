define([
    'jquery',
    './helpers/scrapHelper',
], function($, scrapHelper){
    'use strict'

    let bsFareHoldController = function($scope, $timeout, $interval){

        var ctrl = this

        ctrl.plTitle = scrapHelper.getPriceLockTitle()

        ctrl.headerBanner = scrapHelper.headerBanner()

        ctrl.descriptionBanner = scrapHelper.descriptionBanner()

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
            priceOptions: "<",
            showFareHold: "<",
            optionsLoaded: "<"
        },
        controller: bsFareHoldController,
        template : `
        <div class="fare-hold-container" >
            <section tabindex=0>
                <h3> {{$ctrl.plTitle}} </h3> 
            </section>
            <div class="fare-hold-content text-center">
                <div class="loading-content" data-ng-if="$ctrl.optionsLoaded==false"></div>
                <div data-ng-if="$ctrl.optionsLoaded==true">
                    <div class="fare-hold-content-row blue-bg" tabindex=0 
                    data-ng-bind-html="$ctrl.headerBanner | sanitize">                        
                    </div>
                    <div class="fare-hold-content-row description blue-bg"  
                    data-ng-bind-html="$ctrl.descriptionBanner | sanitize">
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
        </div>
        `
    }
})