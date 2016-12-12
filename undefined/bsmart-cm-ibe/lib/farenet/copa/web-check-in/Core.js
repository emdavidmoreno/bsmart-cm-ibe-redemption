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
          host = 'https://smart-prepro.securitytrfx.com/app/modules/bsmart-cm-ibe/lib/farenet/copa/web-check-in';

          // bind to all pages
          if (window.location.pathname.match(/web\/check/)) {
            url = host + '/WebCheckAll.dist.0cf171be5c589562.js';
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
        }
      });
    }
  }, 300);

})();

