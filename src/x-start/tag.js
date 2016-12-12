(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  // This script gonna variate between pages
  s.src = 'https://@@HOST/app/modules/bsmart-cm-ibe/lib/farenet/copa/Core.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();
// BooksMart Script
(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://@@HOST/app/modules/bsmart-cm-ibe/x-start/bs.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();