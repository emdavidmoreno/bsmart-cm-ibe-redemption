(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  // This script gonna variate between pages
  s.src = 'https://@@HOST/app/modules/bsmart-cm-ibe-redemption/lib/farenet/copa/Core.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();
// BooksMart Script
(function() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://@@HOST/app/modules/bsmart-cm-ibe-redemption/x-start/bs.dist.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();