#!/bin/bash

# Add npm binaries to path
export PATH=./node_modules/.bin:$PATH

function templative() {
    pythonPath=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pythonPath="./python/__main__ serve --port 8080"
    elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
        pythonPath="C:/Users/User/Documents/git/templative-frontend/python/__main__.exe"
    else
        echo "Cannot create Templative app for unknown OS" 
        return
    fi
    $pythonPath serve --port 8080
}

function createTemplativeApp() {
    pythonPath=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pythonPath="/Users/oliverbarnum/Documents/git/templative/templative/__main__.py"
    elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
        pythonPath="C:/Users/User/Documents/git/nextdaygames/templative/templative/__main__.py"
    else
        echo "Cannot create Templative app for unknown OS" 
        return
    fi
    pyinstaller \
        --distpath ./python \
        -y \
        --onefile $pythonPath \
        --hidden-import engineio.async_drivers.aiohttp \
        --hidden-import engineio.async_aiohttp \
        --collect-all templative
}

function getOSTarget() {
    echo $(uname -m)
    echo "$OSTYPE"
    
    return ""
}

# Notes on architecture https://stackoverflow.com/questions/48678152/how-to-detect-386-amd64-arm-or-arm64-os-architecture-via-shell-bash
function createStaticReactServerApp() {
    osIdentifer=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ $(uname -m) == "arm" ]]; then
            osIdentifer="-t node18-macos-arm64"
        else
            osIdentifer="-t node18-macos-x64"
        fi
    fi
    if [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys"  ]]; then
        osIdentifer="-t node18-win"
    fi
    react-scripts build
    pkg ./react/app.js --out-path ./build $osIdentifer
}
function make() {
    osIdentifer=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osIdentifer="--arch=arm64,universal,x86 --platform darwin"
    elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys"  ]]; then
        osIdentifer="--platform win32"
    fi
    electron-forge make $osIdentifer
}

function exe() {
    createTemplativeApp && createStaticReactServerApp && make
}

# Run a function name in the context of this script
eval "$@"