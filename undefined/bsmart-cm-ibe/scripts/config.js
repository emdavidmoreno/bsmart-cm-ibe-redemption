define([], function() {
  'use strict';

  var instance = {};
  var config = {
    // describe the element which gonna contain the module
    insertNodeCommand: {
      selector: 'body',
      command: 'appendTo',
      template: ''
    },
    stylesFilesPath: [
    '//smart-prepro.securitytrfx.com/app/modules/copa-responsive-booking/styles/index.bac58075acf73bf2.css'
    ]
  };
  instance.getConfig = function() {
    return config;
  };
  return instance;
});
