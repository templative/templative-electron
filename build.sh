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
        -n templative \
        --onefile $pythonPath \
        --hidden-import engineio.async_drivers.aiohttp \
        --hidden-import engineio.async_aiohttp \
        --collect-all templative
}

# Notes on architecture https://stackoverflow.com/questions/48678152/how-to-detect-386-amd64-arm-or-arm64-os-architecture-via-shell-bash
function createStaticReactServerApp() {
    osIdentifer=""
    # echo $OSTYPE
    # echo $(uname -m)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osIdentifer="-t node18-macos-arm64"
        # if [[ $(uname -m) == "arm" ]]; then
            # osIdentifer="-t node18-macos-arm64"
        # elif [[ $(uname -m) == "x86_64" ]]; then
        osIdentifer="-t node18-macos-x64"
        # else
            # echo "!!! Using default os for MacOS!"
        # fi
    fi
    if [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys"  ]]; then
        osIdentifer="-t node18-win"
    fi
    echo $osIdentifer
    react-scripts build
    pkg ./react/app.js --out-path ./build $osIdentifer
}
function make() {
    osIdentifer=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osIdentifer="--arch=x64 --platform darwin" #arm64,universal,x64,
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