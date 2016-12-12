define([], function() {
  'use strict';
  //jshint -W003

  function hostUIService(){
    var hostUIService = {};

    hostUIService.setupHostUI = function() {
      console.log('hostUIService.setupHostUI');
    };

    hostUIService.appendHTML = function(html){
      $('.m-book-smart').append(html);
    };

    return hostUIService;
  }
  angular
      .module('responsiveBookingEngine')
      .factory('hostUIService', hostUIService);
});
