#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var filestocopy = [{
    "local/extraConfig/build-extras.gradle":
        "platforms/android/build-extras.gradle"
}, {
    "local/extraConfig/release-signing.properties":
        "platforms/android/release-signing.properties"
}];

// no need to configure below
var rootdir = process.argv[2];

if (rootdir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x = 0; x < platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();

            if(platform == 'android') {
                filestocopy.forEach(function(obj) {
                    Object.keys(obj).forEach(function(key) {
                        var val = obj[key];
                        var srcfile = path.join(rootdir, key);
                        var destfile = path.join(rootdir, val);
                        console.log("copying " + srcfile);
                        var destdir = path.dirname(destfile);
                        if (fs.existsSync(srcfile)) {
                            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
                        }
                    });
                });
            }
        } catch(e) {
            process.stdout.write(e);
        }
    }

}