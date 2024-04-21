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
    pipenv run pip show asyncclick

    echo anyio
    pipenv run pip show anyio

    echo aiofile
    pipenv run pip show aiofile

    echo aiohttp
    pipenv run pip show aiohttp

    echo tabulate
    pipenv run pip show tabulate

    echo pillow
    pipenv run pip show pillow

    echo fpdf
    pipenv run pip show fpdf

    echo markdown2
    pipenv run pip show markdown2

    echo svgmanip
    pipenv run pip show svgmanip

    echo setuptools
    pipenv run pip show setuptools

    echo aiohttp-cors
    pipenv run pip show aiohttp-cors

    echo python-socketio
    pipenv run pip show python-socketio

    echo numpy
    pipenv run pip show numpy

    pipenv run pyinstaller \
        --distpath ../bin \
        -y \
        -n templative \
        --onefile ./templative/__main__.py \
        --debug=all \
        --hidden-import engineio.async_drivers.aiohttp \
        --hidden-import engineio.async_aiohttp \
        --hidden-import asyncclick \
        --hidden-import anyio \
        --hidden-import aiofile \
        --hidden-import aiohttp \
        --hidden-import tabulate \
        --hidden-import pillow \
        --hidden-import fpdf \
        --hidden-import markdown2 \
        --hidden-import svgmanip \
        --hidden-import setuptools \
        --hidden-import aiohttp-cors \
        --hidden-import python-socketio \
        --hidden-import numpy \
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