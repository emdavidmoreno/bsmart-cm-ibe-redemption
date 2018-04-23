define([
    'jquery',
    './helpers/scrapHelper'
], function($, scrapHelper){
    'use strict'

    let bsFareHoldPriceSummaryComponent = function($scope, $timeout){
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

        ctrl.fhPriceSummary = {
            existFareHoldTable: scrapHelper.existFareHoldTable(),
            getFareHoldCategory: scrapHelper.getFareHoldCategory(),
            getFareHoldPrice: scrapHelper.getFareHoldPrice(),
            getFareHoldTaxesLabel: scrapHelper.getFareHoldTaxesLabel(),
            getFareHoldTaxesPrice: scrapHelper.getFareHoldTaxesPrice(),
            getFareHoldTotalLabel: scrapHelper.getFareHoldTotalLabel(),
            getFareHoldTotalPrice: scrapHelper.getFareHoldTotalPrice()
        }
                
    }

    bsFareHoldPriceSummaryComponent.$inject = ['$scope', '$timeout'];

    return {
        bindings: {
            states: '<'
        },
        controller: bsFareHoldPriceSummaryComponent,
        template: `
        <div data-ng-if="$ctrl.fhPriceSummary.existFareHoldTable == true"
            class="m-card m-card--flat m-card--bordered m-card--primary margin-bottom-sm">
            <section>
                <div class="fhps-content">
                    <p>
                        <strong >
                         {{$ctrl.fhPriceSummary.getFareHoldCategory}} :
                        </strong>
                        <span class="pull-right">
                          {{$ctrl.fhPriceSummary.getFareHoldPrice}}
                        </span>
                    </p>
                    <p>
                        <strong class="ng-binding">
                            {{$ctrl.fhPriceSummary.getFareHoldTaxesLabel}}:
                        </strong>
                        <span class="pull-right ng-binding">
                            {{$ctrl.fhPriceSummary.getFareHoldTaxesPrice}}
                        </span>
                    </p>
                </div>               
            </section>
            <header class="title">
                <h4 class="title-text ng-binding">
                    {{$ctrl.fhPriceSummary.getFareHoldTotalLabel}}
                    <strong class="title-text--right ng-binding">
                        {{$ctrl.fhPriceSummary.getFareHoldTotalPrice}}
                    </strong>
                </h4>
            </header>
            
        </div>
        `
    }
})