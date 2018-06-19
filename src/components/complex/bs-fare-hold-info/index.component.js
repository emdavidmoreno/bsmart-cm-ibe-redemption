define([
    'jquery',
    './helpers/scrapHelper',
  ], ($, 
    scrapHelper,
) => {
    'use strict'

    let bsFareHoldInfoController = function(){

        let ctrl = this

        ctrl.fareHoldTitle = scrapHelper.fareHoldTitle()
        ctrl.fareHoldPrice = scrapHelper.fareHoldPrice()
        ctrl.fareHoldTotal = scrapHelper.fareHoldTotal()
        ctrl.showFareHoldInfo = scrapHelper.showFareHoldInfo()

    }

    return {
        bindings: {
            states: '<'
        },
        controller: bsFareHoldInfoController,
        template: `
        <div data-ng-if="$ctrl.showFareHoldInfo"
            class="m-card m-card--flat m-card--bordered m-card--primary margin-bottom-sm">
            
            <div class="bs-fhi-content">
                <p tabindex=0>
                    <strong >
                    {{$ctrl.fareHoldTitle}} :
                    </strong>
                    <span class="pull-right">
                    {{$ctrl.fareHoldPrice}}
                    </span>
                </p>
                
            </div>  
            <header class="bs-fhi-title">
                <h4 tabindex=0 class="text-right">                    
                    <strong> {{$ctrl.fareHoldTotal}}</strong>                    
                </h4>
            </header>                    
        </div>
        `
    }
})