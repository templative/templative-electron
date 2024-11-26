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
    $pythonPath serve --port 8085
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

    if [[ "$OSTYPE" == "darwin"* ]]; then
        CAIRO_PREFIX=$(brew --prefix cairo)
        LIBPNG_PREFIX=$(brew --prefix libpng)
        ZLIB_PREFIX=$(brew --prefix zlib || echo "/usr/lib")
        LIBFFI_PREFIX=$(brew --prefix libffi)

        echo "Cairo prefix: $CAIRO_PREFIX"
        echo "LibPNG prefix: $LIBPNG_PREFIX"
        echo "Zlib prefix: $ZLIB_PREFIX"
        echo "Libffi prefix: $LIBFFI_PREFIX"

        export LDFLAGS="-L$CAIRO_PREFIX/lib -L$LIBPNG_PREFIX/lib -L$ZLIB_PREFIX/lib -L$LIBFFI_PREFIX/lib"
        export CPPFLAGS="-I$CAIRO_PREFIX/include -I$LIBPNG_PREFIX/include -I$ZLIB_PREFIX/include -I$LIBFFI_PREFIX/include"
        export PKG_CONFIG_PATH="$CAIRO_PREFIX/lib/pkgconfig:$LIBPNG_PREFIX/lib/pkgconfig:$ZLIB_PREFIX/lib/pkgconfig:$LIBFFI_PREFIX/lib/pkgconfig"

        ls "$CAIRO_PREFIX/lib"
        ls "$LIBPNG_PREFIX/lib"
        ls "$ZLIB_PREFIX/lib" || ls "$ZLIB_PREFIX"

        pipenv run pyinstaller --distpath ../bin -y -n templative \
        --log-level=DEBUG ./templative/__main__.py \
        --hidden-import=asyncclick \
        --hidden-import=engineio.async_drivers.aiohttp \
        --hidden-import=engineio.async_aiohttp \
        --collect-all templative \
        --add-data="./templative/lib/create/componentTemplates:templative/lib/create/componentTemplates" \
        --add-binary="$CAIRO_PREFIX/lib/libcairo.2.dylib:lib" \
        --add-binary="$LIBPNG_PREFIX/lib/libpng16.16.dylib:lib" \
        --add-binary="$ZLIB_PREFIX/lib/libz.1.dylib:lib" \
        --additional-hooks-dir=./pyinstallerHooks \
        --runtime-hook=./hooks/dylib.py \
        --codesign-identity "Developer ID Application: Go Next Games LLC (829PN2W7LK)"

    elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
        # You need to install cairo dlls using mysys64 locally
        # pacman -S mingw-w64-x86_64-cairo mingw-w64-x86_64-pango mingw-w64-x86_64-libffi mingw-w64-x86_64-zlib
        pipenv run pyinstaller --distpath ../bin -y -n templative \
        --log-level=DEBUG ./templative/__main__.py \
        --hidden-import=engineio.async_drivers.aiohttp \
        --hidden-import=engineio.async_aiohttp --collect-all templative \
        --add-data="./templative/lib/create/componentTemplates:templative/lib/create/componentTemplates" \
        --additional-hooks-dir=./python/pyinstallerHooks \
        --codesign-identity "Developer ID Application: Go Next Games LLC (829PN2W7LK)"
    else
        echo "Cannot create Templative app for unknown OS" 
        cd ..
        return
    fi
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