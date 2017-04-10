define([
  'jquery',
  '../../../_components/complex/bs-btn-continue/index.component',
  '../../../_components/helpers/ngUtils',
], function($, bsFieldParent, ngUtils) {
  'use strict'
  let bsFieldChildController =
    ngUtils.extendController(function($scope, $timeout) {
     /**
     - overwrite parent functions
     this.$onInit = function(){
       -  execute parent functions
       this._super.$onInit();
     }
     - you can add your own functions
     this.getName = function(){
       return 'Pepe';
     }
     **/
    }, bsFieldParent.controller)

  bsFieldChildController.$inject = ['$scope', '$timeout']

  return {
    bindings: bsFieldParent.bindings,
    template: bsFieldParent.template,
    controller: bsFieldChildController,
  }
})
