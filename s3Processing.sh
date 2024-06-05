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
    aws s3 cp s3://$TEMP_BUCKET/Templative-$version\ Setup.exe $LOCAL_DIR/Templative-$version\ Setup.exe
    aws s3 cp s3://$TEMP_BUCKET/templative-$version-delta.nupkg $LOCAL_DIR/templative-$version-delta.nupkg
    aws s3 cp s3://$TEMP_BUCKET/templative-$version-full.nupkg $LOCAL_DIR/templative-$version-full.nupkg
}

sign_setup_exe() {
    local version=$1
    TIMESTAMP_SERVER="http://timestamp.sectigo.com"

    echo "Signing..."
    signtool sign -sha1 "$GONEXTGAMES_CODESIGNINGCERTIFICATE_THUMBPRINT" -tr "$TIMESTAMP_SERVER" -td sha256 -fd sha256 "$LOCAL_DIR/Templative-$version Setup.exe"
}

upload_signed_files() {
    local version=$1
    aws s3 cp $LOCAL_DIR/Templative-$version\ Setup.exe s3://$FINAL_BUCKET/Templative-$version\ Setup.exe
    aws s3 cp $LOCAL_DIR/templative-$version-delta.nupkg s3://$FINAL_BUCKET/templative-$version-delta.nupkg
    aws s3 cp $LOCAL_DIR/templative-$version-full.nupkg s3://$FINAL_BUCKET/templative-$version-full.nupkg
}
remove_local_files() {
    rm "$LOCAL_DIR/Templative-$version Setup.exe"
    rm "$LOCAL_DIR/templative-$version-delta.nupkg"
    rm "$LOCAL_DIR/templative-$version-full.nupkg"
}
remove_unsigned_aws_files() {
    aws s3 rm "s3://$TEMP_BUCKET/Templative-$version Setup.exe"
    aws s3 rm "s3://$TEMP_BUCKET/templative-$version-delta.nupkg"
    aws s3 rm "s3://$TEMP_BUCKET/templative-$version-full.nupkg"
}
process_setup_file() {
    local setup_file=$1
    local version

    version=$(echo "$setup_file" | grep -oP '(?<=Templative-).*')

    echo "Found $setup_file version $version. Starting download..."

    download_files "$version"
    if [ $? -eq 0 ]; then
        echo "Downloaded files for version $version. Starting signing process..."

        sign_setup_exe "$version"
        if [ $? -eq 0 ]; then
            echo "Signed setup.exe for version $version. Starting upload to final S3 bucket..."

            upload_signed_files "$version"
            if [ $? -eq 0 ]; then
                echo "Uploaded signed files for version $version to $FINAL_BUCKET."
                # Signed files are used to create packages deltas in the unsigned folder
                # remove_unsigned_aws_files
                remove_local_files
            else
                echo "Failed to upload signed files for version $version to $FINAL_BUCKET."
            fi
        else
            echo "Failed to sign setup.exe for version $version."
        fi
    else
        echo "Failed to download files for version $version."
    fi
}
# The releases file is used to manage versions, I think both post and getting versions relies on this.
copy_releases_file() {
    aws s3 cp s3://$TEMP_BUCKET/RELEASES s3://$FINAL_BUCKET/RELEASES
}
check_for_new_files() {
    echo "Checking for new setup.exe in $TEMP_BUCKET..."

    setup_files=$(aws s3 ls "s3://$TEMP_BUCKET/" | grep 'Setup.exe' | awk '{print $4}')

    for setup_file in $setup_files; do
        process_setup_file "$setup_file"
    done
    copy_releases_file
}
check_for_new_files
