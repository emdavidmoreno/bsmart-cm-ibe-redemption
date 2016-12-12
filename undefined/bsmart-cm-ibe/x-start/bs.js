/**
 * We need to do that because in some pages
 * there are a "require" instance already loaded
 * So we need add Multiversion support
 *
 * //http://requirejs.org/docs/api.html#multiversion
 */
(function() {
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

  // This validations should not be here
  if(getDeviceCategory() === 'mobile'){

    // basic bsmart configuration
    if (!window.Bs) {
        window.Bs = {};
    }

    // basic bsmart configuration
    Bs.conf = {
        assetsMap: {
  "modules/bsmart-cm-ibe/styles/index.css": "bac58075acf73bf2",
  "modules/bsmart-cm-ibe/modules/ibe-search-result/styles/index.css": "2ff53cfb74742aec",
  "modules/bsmart-cm-ibe/modules/ibe-payment/styles/index.css": "9655598fdc8c022c",
  "modules/bsmart-cm-ibe/modules/ibe-passenger-information/styles/index.css": "42351da2002e0a6f",
  "modules/bsmart-cm-ibe/modules/ibe-itinerary-summary/styles/index.css": "bb8346a862891e8e",
  "modules/bsmart-cm-ibe/modules/ibe-external-booking-mask/styles/index.css": "0cfb9d34d4f9ccd4",
  "modules/bsmart-cm-ibe/modules/ibe-confirmation-hold/styles/index.css": "f0d824dce0c5ee7b",
  "modules/bsmart-cm-ibe/x-start/tag": "211fc452552f2f3c",
  "modules/bsmart-cm-ibe/x-start/bs": "53155bfd5cb7f21f",
  "modules/bsmart-cm-ibe/modules/ibe-search-result/module": "7edbe9941069cb0d",
  "modules/bsmart-cm-ibe/modules/ibe-payment/module": "8225ce17c62b8658",
  "modules/bsmart-cm-ibe/modules/ibe-passenger-information/module": "c5d879825048e570",
  "modules/bsmart-cm-ibe/modules/ibe-itinerary-summary/module": "6e17958de3458b29",
  "modules/bsmart-cm-ibe/modules/ibe-external-booking-mask/module": "7b60724b2c53434b",
  "modules/bsmart-cm-ibe/modules/ibe-confirmation-hold/module": "aceeca744eb211a0",
  "modules/bsmart-cm-ibe/module": "b0b5eed9866e3758",
  "modules/bsmart-cm-ibe/lib/farenet/copa/web-check-in/WebCheckAll": "0cf171be5c589562",
  "modules/bsmart-cm-ibe/lib/farenet/copa/Summary": "5948978812177fbb",
  "modules/bsmart-cm-ibe/lib/farenet/copa/Search": "129ee541e4c2c826",
  "modules/bsmart-cm-ibe/lib/farenet/copa/Payment": "868b67115e35895b",
  "modules/bsmart-cm-ibe/lib/farenet/copa/Passengers": "2454b1070ba48f61",
  "modules/bsmart-cm-ibe/lib/farenet/copa/FlightSelectionToDataCore.min": "e299cb75dc924b17",
  "modules/bsmart-cm-ibe/lib/farenet/copa/FlightSelectionToDataCore": "456c27fef0ab6b01",
  "modules/bsmart-cm-ibe/lib/farenet/copa/FlightSelection.min": "0c69e3f2a7bf016c",
  "modules/bsmart-cm-ibe/lib/farenet/copa/FlightSelection": "b8bdc39d79d90c1e",
  "modules/bsmart-cm-ibe/lib/farenet/copa/ConfirmationPay": "ecf1e089ce842cf5",
  "modules/bsmart-cm-ibe/lib/farenet/copa/ConfirmationHold": "2c94d439bc45964d",
  "modules/bsmart-cm-ibe/_core/bs-core": "6fa5513f94c45059"
},
        caos: 0,
        isProd: 0,
        restoreInterface: 1,
        restore: {},
        restoreFunction: {},
        version: '1.0.0',
        clientHost: 'smart-prepro.securitytrfx.com',
        backendHost: 'api-smart.securitytrfx.com',
        useLocalRules: 1,
        localRules: [
          {
            "name": "Copa Airlines Responsive Booking",
            "thenSet": [{
              "name": "bsmart-cm-ibe",
              "mainFilePath": "",
              "variables": [{
                url:  document.URL,
              }]
            }]            
          }
        ]
    };

    function getHashParams() {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
          hashParams[d(e[1])] = d(e[2]);

        return hashParams;
    }

    var hashParams = getHashParams();
    if(hashParams.client){
      Bs.conf.clientHost = hashParams.client;
    }

    // Intitializing require
    var w = window,
        d = document,
        s;
    if(w.require){
      w.bSRequire = require.config({
          baseUrl: "https://" + Bs.conf.clientHost + "/app/modules/bsmart-cm-ibe/",
          context: "bs1.0.0",
      });
      w.bSRequire( ["require", "https://" + Bs.conf.clientHost + "/app/modules/bsmart-cm-ibe/_core/init.js"],
        function() {}
      );
    } else{
      s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://' + Bs.conf.clientHost + '/app/modules/bsmart-cm-ibe/lib/require/require.js';
      s.setAttribute('data-main', 'https://' + Bs.conf.clientHost + '/app/modules/bsmart-cm-ibe/_core/init');
      document.body.appendChild(s);
    }

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


    /**
     * Inject a custom styles into the host page
     * @param  {string} rule css to insert
     */
    function injectStyles(rule) {
      var div = $("<div />", {
        html: '&shy;<style>' + rule + '</style>'
      }).appendTo("body");
    }

    /**
     * Setup the host interface
     */
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

    // If in 1 minute (30000) booksmart it's not loaded we
    // restore the interface automatically
    setTimeout(Bs.conf.restoreFunction, 30000);    
  }
})();
