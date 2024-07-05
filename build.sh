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

function moveSignedOsxFiles() {
    arch=$1
    version=$2
    TEMP_BUCKET="s3://templative-artifacts/darwin/unsigned/$arch"
    FINAL_BUCKET="s3://templative-artifacts/darwin/$arch"

    aws s3 cp $TEMP_BUCKET/Templative-darwin-$arch-$version.zip $FINAL_BUCKET/Templative-darwin-$arch-$version.zip
    aws s3 cp $TEMP_BUCKET/RELEASES.json $FINAL_BUCKET/RELEASES.json
}

function createTemplativeApp() {
    cd ./python
    pipenv --rm
    pipenv install
    pipenv run pip show
    rm -rf ../bin/templative
    pipenv run pyinstaller --distpath ../bin -y -n templative \
        --log-level=DEBUG ./templative/__main__.py \
        --hidden-import=engineio.async_drivers.aiohttp \
        --hidden-import=engineio.async_aiohttp --collect-all templative \
        --add-data="./templative/lib/create/componentTemplates:templative/lib/create/componentTemplates" \
        --codesign-identity "Developer ID Application: Go Next Games LLC (829PN2W7LK)"
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