module.exports = {
    getRequireConfig: function () {
        return {
                options: {
                    baseUrl: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe',
                    paths: {
                        jquery: 'empty:',
                        angular: 'empty:',
                        lodash: './lib/lodash/lodash.min',
                        contextDataService: 'empty:',
                        loadModuleService: 'empty:',
                        compatibilityService: 'empty:',
                        statsService: 'empty:',
                        assetsLoaderService: 'empty:',
                        booksmartService: 'empty:',
                        ruleService: 'empty:',
                        'angular-translate': './lib/angular/angular-translate.min',
                        tmhDynamicLocale: './lib/angular/tmhDynamicLocale.min',
                        'jquery-ui': './lib/jquery-ui',
                    },
                    optimize: 'uglify2',
                    uglify2: {
                        drop_console: true,
                        compress: {
                            drop_console: true
                        }
                    },
                    shim: {},
                    include: [
                        './modules/ibe-external-booking-mask/scripts/init',
                        './modules/ibe-external-booking-mask/scripts/app'
                    ],
                    out: '<%= package.directories.deploy %>/app/modules/bsmart-cm-ibe/modules/ibe-external-booking-mask/module.dist.js',
                    error: function (done, err) {
                        console.log(err);
                        done();
                    }
                }
            }
    }
}
