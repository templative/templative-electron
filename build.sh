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
    pipenv run pip show

    pipenv run pyinstaller --distpath ../bin -y -n templative --log-level=DEBUG --onefile ./templative/__main__.py --hidden-import=engineio.async_drivers.aiohttp --hidden-import=engineio.async_aiohttp --collect-all templative --add-data "./templative/lib/create/componentTemplates;templative/lib/create/componentTemplates" --codesign-identity "Developer ID Application: Go Next Games LLC (829PN2W7LK)"
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