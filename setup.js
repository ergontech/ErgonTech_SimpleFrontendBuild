#!/usr/bin/env node

const fs  = require('fs'),
      cwd = process.cwd();

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

copyFile(cwd + 'node_modules/ergon-easy-build/gulpfile.js', cwd + '/gulpfile.js', function(err){
    if (typeof err !== 'undefined') console.log(err);
});