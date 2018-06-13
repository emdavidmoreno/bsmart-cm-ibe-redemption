define([
    'jquery',
    './helpers/scrapHelper',
], function($, scrapHelper){
    'use strict'

    let bsFareHoldController = function($scope, $timeout, $interval){

        this.$onChanges = function(changes){
            console.log("new changes: ", changes)
            scrapHelper.waitToLoad(scrapHelper.existFareHold).then((resolved) =>{
                console.log("resolved promise")
                if(resolved){
                    $scope.$evalAsync(()=>{
                        //ctrl.existFareHold = scrapHelper.existFareHold()    
                        ctrl.plTitle = scrapHelper.getPriceLockTitle()        
                        ctrl.headerBanner = ""//scrapHelper.headerBanner()        
                        ctrl.descriptionBanner = ""//scrapHelper.descriptionBanner()        
                        ctrl.fareHoldText = scrapHelper.getFareHoldText()
                    })
                }
                
            })
        }
        var ctrl = this        
        ctrl.existFareHold = false

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
            optionsLoaded: "<",
            advertisement: "<",
            showAds: "<"
        },
        controller: bsFareHoldController,
        template : `
        <div class="fare-hold-container" data-ng-if="$ctrl.existFareHold">
            <section tabindex=0>
                <h3> {{$ctrl.plTitle}} </h3> 
            </section>
            <div class="fare-hold-content text-center">
                <div class="loading-content" data-ng-if="$ctrl.optionsLoaded==false"></div>
                <div data-ng-if="$ctrl.optionsLoaded==true">
                    <div class="advertisement" data-ng-if="$ctrl.showAds" data-ng-bind-html="$ctrl.advertisement | sanitize"></div>
                    <div data-ng-if="!$ctrl.showAds">
                        <div ng-if="false" class="fare-hold-content-row blue-bg" tabindex=0 
                        data-ng-bind-html="$ctrl.headerBanner | sanitize">                        
                        </div>
                        <div ng-if="false" class="fare-hold-content-row description blue-bg" tabindex=0 
                        data-ng-bind-html="$ctrl.descriptionBanner | sanitize">
                        </div>
                        <div class="fare-hold-content-row fare-hold-text" tabindex=0
                        data-ng-bind-html="$ctrl.fareHoldText | sanitize">
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
        </div>
        `
    }
})