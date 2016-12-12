(function(){
    function hostUIService(){
      var hostUIService = {};
      return hostUIService;
    }
    angular
        .module('responsiveBookingEngine')
        .factory('hostUIService', hostUIService);
})();
