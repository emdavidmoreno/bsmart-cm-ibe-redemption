define([
  '../../../../../lib/dot/doT'
], function(doT) {
  var instance = {};
  var templateCollection = {};

  instance.getRenderedTemplate = function(name, template, data) {
    var result;
    if (templateCollection[name]) {
      result = templateCollection[name](data);
    } else {
      var templateFunct = doT.template(template);
      result = templateFunct(data);
      templateCollection[name] = templateFunct;
    }
    return result;
  };

  return instance;
});
