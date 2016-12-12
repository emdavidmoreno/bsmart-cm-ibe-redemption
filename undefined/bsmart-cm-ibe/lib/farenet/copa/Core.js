(function(){

  var timer = setInterval(function() {
    if (typeof window.jQuery !== 'undefined') {
      clearInterval(timer);

      $(function() {
        var parsingCompleted = 0;

        // First time append
        appendScript();

        // Event is triggered when parsing is over
        $(window).on('parse:completed', function (event, result) {
          parsingCompleted = 1;
          console.log('Parsing completed status: ' + parsingCompleted);

          // If you need to work with JSON result,
          // it's available in 'result'
          // console.log('result:', result);
        });

        // Bind a change handler to the window location.
        $(window.location).bind('change', appendScript);

        function appendScript() {
          var url = '',
              host = 'https://smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/lib/farenet/copa';

          if (window.location.pathname === '/CMGS/AirSearchExternalForward.do') {

            url = host + '/Search.dist.129ee541e4c2c826.js';
            console.log('Page: Search');

          } else if (window.location.pathname === '/CMGS/AirFareFamiliesForward.do' || window.location.pathname === '/CMGS/AirFareFamiliesFlexibleForward.do' ||
                     window.location.pathname ==='/CMGS/AirAvailabilitySearchForward.do' ||  window.location.pathname === '/CMGS/AirLowFareSearchExternal.do') {

            url = host + '/FlightSelection.dist.b8bdc39d79d90c1e.js';
            console.log('Page: FlightSelection');

          } else if (window.location.pathname === '/CMGS/ItinerarySummary.do') {

            url = host + '/Summary.dist.5948978812177fbb.js';
            console.log('Page: Summary');

          } else if (window.location.pathname === '/CMGS/TravelersDetailsForwardAction.do') {

            url = host + '/Passengers.dist.2454b1070ba48f61.js';
            console.log('Page: Passengers');

          } else if (window.location.pathname === '/CMGS/PaymentForward.do') {

            url = host + '/Payment.dist.868b67115e35895b.js';
            console.log('Page: Payment');

          } else if (window.location.pathname === '/CMGS/ConfirmationForward.do') {

            url = host + '/ConfirmationHold.dist.2c94d439bc45964d.js';
            console.log('Page: Confirmation');
          }
          $.ajax({
                url: url,
                dataType: "script",
                cache: true
          })
          .done(function() {
              console.log('Script loaded.');
          })
          .fail(function() {
              console.log('Script is not loaded.');
              window.Farenet = { notTriggered: 1 };
          });

          /*$.getScript(url)
            .done(function() {
              console.log('Script loaded.');
            })
            .fail(function() {
              console.log('Script is not loaded.');
              window.Farenet = { notTriggered: 1 };
          });*/
       }
      });
    }
  }, 300);

})();

