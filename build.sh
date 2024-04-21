#!/bin/bash

# Add npm binaries to path
export PATH=./node_modules/.bin:$PATH

function templative() {
    pythonPath=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pythonPath="./bin/__main__"
    elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
        pythonPath="./bin/__main__.exe"
    else
        echo "Cannot create Templative app for unknown OS" 
        return
    fi
    $pythonPath serve --port 8080
}

function createTemplativeApp() {
    cd ./python
    pipenv --rm
    pipenv install
    echo asyncclick
    pip show asyncclick

    echo anyio
    pip show anyio

    echo aiofile
    pip show aiofile

    echo aiohttp
    pip show aiohttp

    echo tabulate
    pip show tabulate

    echo pillow
    pip show pillow

    echo fpdf
    pip show fpdf

    echo markdown2
    pip show markdown2

    echo svgmanip
    pip show svgmanip

    echo setuptools
    pip show setuptools

    echo aiohttp-cors
    pip show aiohttp-cors

    echo python-socketio
    pip show python-socketio

    echo numpy
    pip show numpy

    pipenv run pyinstaller \
        --distpath ../bin \
        -y \
        -n templative \
        --onefile ./templative/__main__.py \
        --debug=all \
        --hidden-import engineio.async_drivers.aiohttp \
        --hidden-import engineio.async_aiohttp \
        --hidden-import asyncclick \
        --collect-all templative \
        --codesign-identity "Developer ID Application: Next Day Games LLC (Y9RWBVMY7R)"
    cd ..
}

function package() {
    electron-forge package
}
function make() {
    electron-forge make
}
function makeFromPackage() {
    electron-forge make --skip-package
}
function publish() {
    electron-forge publish
}
function createPublishDryRun() {
    electron-forge publish --dry-run
}
function publishDryRun() {
    electron-forge publish --from-dry-run
}

function fullPackage() {
    createTemplativeApp && package
}
function fullMake() {
    createTemplativeApp && make
}
function fullPublish() {
    createTemplativeApp && publish
}

# Run a function name in the context of this script
eval "$@"