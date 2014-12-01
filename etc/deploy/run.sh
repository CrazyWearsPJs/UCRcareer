#!/bin/bash

# Run bower install
pushd site
../node_modules/bower/bin/bower install
popd

# Run gulp build
./node_modules/gulp/bin/gulp.js make:js build:css