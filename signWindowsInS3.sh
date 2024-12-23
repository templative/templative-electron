#!/bin/bash

TEMP_BUCKET="templative-artifacts/win32/unsigned/x64"
FINAL_BUCKET="templative-artifacts/win32/x64"
LOCAL_DIR="./temp"

if [ -z "$GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT" ]; then
    echo "GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT environment variable is not set. Exiting."
    exit 1
fi

download_files() {
    local version=$1
    echo "Downloading s3://$TEMP_BUCKET/Templative-$version\ Setup.exe $LOCAL_DIR/Templative-$version\ Setup.exe"
    aws s3 cp s3://$TEMP_BUCKET/Templative-$version\ Setup.exe $LOCAL_DIR/Templative-$version\ Setup.exe

    echo "s3://$TEMP_BUCKET/Templative-win32-x64-$version.zip $LOCAL_DIR/Templative-win32-x64-$version.zip"
    aws s3 cp s3://$TEMP_BUCKET/Templative-win32-x64-$version.zip $LOCAL_DIR/Templative-win32-x64-$version.zip
}
unzip_file() {
    local version="$1"
    echo "Unzipping $LOCAL_DIR/Templative-win32-x64-$version.zip"
    unzip "$LOCAL_DIR/Templative-win32-x64-$version.zip" -d "$LOCAL_DIR/Templative-win32-x64-$version"
    rm "$LOCAL_DIR/Templative-win32-x64-$version.zip"
}
rezip_directory() {
    local version="$1"
    echo "Rezipping"
    (cd "$LOCAL_DIR" && zip -r "Templative-win32-x64-$version.zip" "Templative-win32-x64-$version")
    rm -rf $LOCAL_DIR/Templative-win32-x64-$version
}

sign_setup_exe() {
    local version=$1
    TIMESTAMP_SERVER="http://timestamp.sectigo.com"

    echo "Signing Setup.exe"
    signtool sign -sha1 "$GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT" -tr "$TIMESTAMP_SERVER" -td sha256 -fd sha256 "$LOCAL_DIR/Templative-$version Setup.exe"
    signtool sign -sha1 "$GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT" -tr "$TIMESTAMP_SERVER" -td sha256 -fd sha256 "$LOCAL_DIR/Templative-win32-x64-$version/templative-$version Setup.exe"
}

upload_signed_files() {
    local version=$1
    echo "Uploading Setup, zip, and nupkg's"
    aws s3 cp $LOCAL_DIR/Templative-$version\ Setup.exe s3://$FINAL_BUCKET/Templative-$version\ Setup.exe
    aws s3 cp "$LOCAL_DIR/Templative-win32-x64-$version.zip" "s3://$FINAL_BUCKET/Templative-win32-x64-$version.zip"
    aws s3 cp "s3://$TEMP_BUCKET/templative-$version-delta.nupkg" s3://$FINAL_BUCKET/templative-$version-delta.nupkg
    aws s3 cp "s3://$TEMP_BUCKET/templative-$version-full.nupkg" s3://$FINAL_BUCKET/templative-$version-full.nupkg

}
remove_local_files() {
    echo "Removing local setup and zip"
    rm "$LOCAL_DIR/Templative-$version Setup.exe"
    rm "$LOCAL_DIR/Templative-win32-x64-$version.zip"
}

process_setup_file() {
    local setup_file=$1
    local version

    version=$(echo "$setup_file" | grep -oP '(?<=Templative-).*')

    echo "Considering $version..."
    # The setup exe and nupkg files are posted in the signed area without being signed, does that mean they will download hte signed verison?
    # The only reason we create this the zip file is so that new downloads dont wait as the zip of the nupkg are assembled.
    if aws s3api head-object --bucket "templative-artifacts" --key "win32/x64/Templative-win32-x64-$version.zip" >/dev/null 2>&1; then
        echo "templative-artifacts/win32/x64/Templative-$version Setup.exe already exists so we are skipping."
        return 2
    fi

    download_files "$version"
    if [ $? -ne 0 ]; then
        echo "Failed to download files for version $version."
        return 1
    fi
    unzip_file "$version"
    if [ $? -ne 0 ]; then
        echo "Error Unzipping $version."
        return 1
    fi
    sign_setup_exe "$version"
    if [ $? -ne 0 ]; then
        echo "Error signing $version."
        return 1
    fi
    rezip_directory "$version"
    if [ $? -ne 0 ]; then
        echo "Error zipping directory signed files $version."
        return 1
    fi  
    upload_signed_files "$version"
    if [ $? -ne 0 ]; then
        echo "Error uploading signed files $version."
        return 1
    fi    
    remove_local_files
    if [ $? -ne 0 ]; then
        echo "Error removing local files for $version."
        return 1
    fi
    return 0
}
# The releases file is used to manage versions, I think both post and getting versions relies on this.
copy_releases_file() {
    aws s3 cp s3://$TEMP_BUCKET/RELEASES s3://$FINAL_BUCKET/RELEASES
}
check_for_new_files() {
    echo "Checking for new setup.exe in $TEMP_BUCKET..."

    signed_files=$(aws s3 ls "s3://$FINAL_BUCKET/" | grep 'Setup.exe' | awk '{print $4}')
    setup_files=$(aws s3 ls "s3://$TEMP_BUCKET/" | grep 'Setup.exe' | awk '{print $4}' | tac)

    for setup_file in $setup_files; do
        version=$(echo "$setup_file" | grep -oP '(?<=Templative-).*')
        
        is_signed_already=$(echo "$signed_files" | grep -q "Templative-$version")
        if $is_signed_already; then
            echo "templative-artifacts/win32/x64/Templative-$version Setup.exe already exists so we are skipping."
            continue
        fi
        echo "Processing $version..."
        
        process_setup_file "$setup_file"
    done
    copy_releases_file
}
check_for_new_files
