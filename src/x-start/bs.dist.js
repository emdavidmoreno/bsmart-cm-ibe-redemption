/**
 * We need to do that because in some pages
 * there are a "require" instance already loaded
 * So we need add Multiversion support
 *
 * //http://requirejs.org/docs/api.html#multiversion
 */
(function(window) {
  function getDeviceCategory() {
    var deviceCategory;

    if (navigator.userAgent.match(/iPad|PlayBook|Silk/i)) {
      deviceCategory = 'tablet';
    } else if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|Blackberry|IEMobile|Opera Mini/i)) {
      deviceCategory = 'mobile';
    } else {
      deviceCategory = 'desktop';
    }
    return deviceCategory;
  }

  if(getDeviceCategory() === 'mobile'){
    // Intitializing require
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://@@HOST/app/modules/bsmart-cm-ibe-redemption/_core/@@FILE_PATH--app/core/bs-core.dist.js';
    document.body.appendChild(s);
    if (!window.Bs) {
        window.Bs = {};
    }

    // basic bsmart configuration
    Bs.conf = {
        assetsMap: JSON.parse('@@JS_CODE--app/core/assets-mapping.json'),
        caos: 0,
        isProd: 1,
        restoreInterface: 1,
        restore: {},
        restoreFunction: {},
        version: '@@CLIENT_VERSION',
        useLocalRules: 1,
        localRules: [
          {
            "name": "Copa Airlines Responsive Booking",
            "thenSet": [{
              "name": "bsmart-cm-ibe-redemption",
              "mainFilePath": "",
              "variables": [{
                url:  document.URL
              }]
            }]            
          }
        ]
    };

    /**
    * Write back the original values of the host interface
    */
    Bs.conf.restoreFunction = function (){
      if(Bs.conf.restoreInterface === 1){
        // TODO: uncomment to hide the host screen
        $('html').css('overflow-x', Bs.conf.restore.html_overflow_x);
        $('table.layoutMain').css('display', Bs.conf.restore.table_layoutMain_display);
        $('#drillDown').css('display', Bs.conf.restore.drillDown_display);
        $('head meta[name="viewport"]').remove();
        $('.m-loader').css('display', 'none');
        setTimeout(function(){
          $('table.layoutMain').css('display', Bs.conf.restore.table_layoutMain_display);
          $('html').css('overflow-x', Bs.conf.restore.html_overflow_x);
        }, 2)
      }
    }



    function injectStyles(rule) {
        var div = $("<div />", {
          html: '&shy;<style>' + rule + '</style>'
        }).appendTo("body");
    }

    function setupViewPort() {
      $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">');
      Bs.conf.restore = {
          html_overflow_x: $('html').css('overflow-x'),
          table_layoutMain_display: $('table.layoutMain').css('display'),
          drillDown_display: $('#drillDown').css('display'),
      }
      // TODO: uncomment to hide the host screen
      hideHostScreen();

      var attempsCounter = 50;
      function hideHostScreen(interval){
        if($('table.layoutMain').length > 0 ){
          if( Bs.conf.restoreInterface != 1){
            $('table.layoutMain').css('display', 'none');
            $('#drillDown').css('display', 'none');
            $('html').css('overflow-x', 'hidden');
            if(interval){
              clearInterval(interval);
            }
          } else {
            if(interval && attempsCounter < 1){
              clearInterval(interval);
            }
            attempsCounter--;
          }
        }
      }

      // TODO: We should use (Request Animation Frame)
      // At the beggining there are async behavior
      // in the host interface
      var interval = setInterval(function(){
        hideHostScreen(interval);
      }, 500);
    }

    setupViewPort();

    /**
    * injecting the loader styles inside into the host page
    */
    injectStyles('.m-loader{position:absolute;width:100%;height:100%;background-color:#ffffff;}.m-loader .icon--pure-css:before,.m-loader .icon--pure-css:after,.m-loader .icon--pure-css{border-radius:50%;width:2.5em;height:2.5em;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:load7 1.8s infinite ease-in-out;animation:load7 1.8s infinite ease-in-out;}.m-loader .icon--pure-css{text-indent:-9999em;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation-delay:-0.16s;animation-delay:-0.16s;top:-60px;left:0;position:absolute;right:0;bottom:0;margin:auto;font-size:10px;text-align:center;z-index:100;}.m-loader .icon--pure-css:before{left:-3.5em;-webkit-animation-delay:-0.32s;animation-delay:-0.32s;}.m-loader .icon--pure-css:after{left:3.5em;}.m-loader .icon--pure-css:before,.m-loader .icon--pure-css:after{content:\'\';position:absolute;top:0;}@-webkit-keyframes load7{0%, 80%, 100%{box-shadow:0 2.5em 0 -1.3em;}40%{box-shadow:0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow:0 2.5em 0 -1.3em;}40%{box-shadow:0 2.5em 0 0;}}.m-loader{position:fixed;width:100%;height:100%;z-index:9999999;top:0px;background-color:rgba(255, 255, 255, 1);color:#0060A9;}');
    $('body')
        .append('<div class="m-loader"><div class="icon--pure-css"></div></div>');

    // If in 1 minute (60000) booksmart it's not loaded we
    // restore the interface automatically
    setTimeout(Bs.conf.restoreFunction, 30000);
  }
})(window);
