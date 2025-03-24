#!/bin/bash

# Add npm binaries to path
export PATH=./node_modules/.bin:$PATH

function templative() {
    echo "Templative"
}

function moveSignedOsxFiles() {
    arch=$1
    version=$2
    TEMP_BUCKET="s3://templative-artifacts/darwin/unsigned/$arch"
    FINAL_BUCKET="s3://templative-artifacts/darwin/$arch"

    echo "Moving signed files for architecture: $arch"
    aws s3 cp $TEMP_BUCKET/Templative-darwin-$arch-$version.zip $FINAL_BUCKET/Templative-darwin-$arch-$version.zip
    aws s3 cp $TEMP_BUCKET/RELEASES.json $FINAL_BUCKET/RELEASES.json
}

function package() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Packaging for architecture: $ARCH"
        electron-forge package --arch=$ARCH
    else
        echo "Packaging with default architecture"
        electron-forge package
    fi
}

function make() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Making for architecture: $ARCH"
        electron-forge make --arch=$ARCH
    else
        echo "Making with default architecture"
        electron-forge make
    fi
}

function makeFromPackage() {
    electron-forge make --skip-package
}

function publish() {
    electron-forge publish
}

function createPublishDryRun() {
    electron-forge publish --dry-run --enable-logging
}

function publishDryRun() {
    electron-forge publish --from-dry-run
}

function sign() {
    EXE_PATH="C:\Users\User\Documents\git\templative-frontend\out\make\squirrel.windows\x64\Templative-1.1.31 Setup.exe"
    TIMESTAMP_SERVER="http://timestamp.sectigo.com"
    echo "Signing..."
    signtool sign -sha1 "$GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT" -tr "$TIMESTAMP_SERVER" -td sha256 -fd sha256 "$EXE_PATH"
    echo "Executable signed successfully."

    echo "Verifying the signed executable..."
    signtool verify -pa -v "$EXE_PATH"
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