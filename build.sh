#!/bin/bash

# Add npm binaries to path
export PATH=./node_modules/.bin:$PATH

function templative() {
    echo "Templative"
}

function package() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Packaging for architecture: $ARCH"
        DEBUG=electron-forge:* \
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
        DEBUG=electron-forge:* \
        electron-forge make --arch=$ARCH
    else
        echo "Making with default architecture"
        DEBUG=electron-forge:* \
        electron-forge make
    fi
}

function makeFromPackage() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Making from package for architecture: $ARCH"
        DEBUG=electron-forge:* \
        electron-forge make --skip-package --arch=$ARCH
    else
        echo "Making from package with default architecture"
        DEBUG=electron-forge:* \
        electron-forge make --skip-package
    fi
}

function publish() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Publishing for architecture: $ARCH"
        electron-forge publish --arch=$ARCH
    else
        echo "Publishing with default architecture"
        electron-forge publish
    fi
}

function createPublishDryRun() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Creating publish dry run for architecture: $ARCH"
        electron-forge publish --dry-run --enable-logging --arch=$ARCH
    else
        echo "Creating publish dry run with default architecture"
        electron-forge publish --dry-run --enable-logging
    fi
}

function publishDryRun() {
    # Use the ARCH environment variable if set
    if [ -n "$ARCH" ]; then
        echo "Running publish dry run for architecture: $ARCH"
        electron-forge publish --from-dry-run --arch=$ARCH
    else
        echo "Running publish dry run with default architecture"
        electron-forge publish --from-dry-run
    fi
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

# Run a function name in the context of this script
eval "$@"