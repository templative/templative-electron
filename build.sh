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
    pyinstaller \
        --distpath ./bin \
        -y \
        -n templative \
        --onefile ./python/templative/__main__.py \
        --hidden-import engineio.async_drivers.aiohttp \
        --hidden-import engineio.async_aiohttp \
        --collect-all templative \
        --codesign-identity "Developer ID Application: Next Day Games LLC (Y9RWBVMY7R)"
}

function package() {
    electron-forge package
}
function make() {
    electron-forge make
}
function publish() {
    electron-forge publish
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

function pullCertifications() {
    KEY_CHAIN=build.keychain
    CERTIFICATION_P12=certificate.p12
    echo $CERTIFICATION_OSX_APPLICATION | base64 --decode > $CERTIFICATE_P12
    security create-keychain -p actions $KEY_CHAIN
    security default-keychain -s $KEY_CHAIN
    security unlock-keychain -p actions $KEY_CHAIN
    security import $CERTIFICATE_P12 -k $KEY_CHAIN -P $CERTIFICATE_PASSWORD -T /usr/bin/codesign;
    secruity set-key-partition-list -S apple-tool:,apple: -s -k actions $KEY_CHAIN
    rm -fr *.p12
}

# Run a function name in the context of this script
eval "$@"