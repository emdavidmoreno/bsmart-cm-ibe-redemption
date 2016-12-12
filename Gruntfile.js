'use strict';


module.exports = function(grunt) {
    'use strict';

    // grunt = require('@everymundo/bsmart-tasks/node_modules/grunt');
    grunt.loadGruntfile = function(p) {
        var path = require("path");
        var fs = require("fs");
        var dir;
        var originalDir = process.cwd();

        grunt.projectPath = originalDir;
        if (p.indexOf("Gruntfile") == -1) {
            dir = p;
        } else {
            dir = path.dirname(p);
        }

        // if(!fs.existsSync(`${dir}/node_modules`)) {
        // Si la carpeta node_modules existe en bmart-tasks
        // lo cual es totalmente posible en npm 3 en caso de que halla
        // alguna refenrencia compartida
        // entonces esta solucion se :(
        if(!fs.existsSync(`${dir}/node_modules`)) {
            fs.symlinkSync(`${originalDir}/node_modules`, `${dir}/node_modules`)
        }
        process.chdir(dir);
        require(process.cwd() + "/Gruntfile.js")(grunt);
        process.chdir(originalDir);
    };

    grunt.file.setBase(__dirname + "/node_modules/@everymundo/bsmart-tasks");
    grunt.loadGruntfile(__dirname + "/node_modules/@everymundo/bsmart-tasks");
};