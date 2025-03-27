start-signing-job¶
Description¶
Initiates a signing job to be performed on the code provided. Signing jobs are viewable by the ListSigningJobs operation for two years after they are performed. Note the following requirements:

You must create an Amazon S3 source bucket. For more information, see Creating a Bucket in the Amazon S3 Getting Started Guide .
Your S3 source bucket must be version enabled.
You must create an S3 destination bucket. AWS Signer uses your S3 destination bucket to write your signed code.
You specify the name of the source and destination buckets when calling the StartSigningJob operation.
You must ensure the S3 buckets are from the same Region as the signing profile. Cross-Region signing isn't supported.
You must also specify a request token that identifies your request to Signer.
You can call the DescribeSigningJob and the ListSigningJobs actions after you call StartSigningJob .

For a Java example that shows how to use this action, see StartSigningJob .

See also: AWS API Documentation

Synopsis¶
  start-signing-job
--source <value>
--destination <value>
--profile-name <value>
[--client-request-token <value>]
[--profile-owner <value>]
[--cli-input-json <value>]
[--generate-cli-skeleton <value>]
[--debug]
[--endpoint-url <value>]
[--no-verify-ssl]
[--no-paginate]
[--output <value>]
[--query <value>]
[--profile <value>]
[--region <value>]
[--version <value>]
[--color <value>]
[--no-sign-request]
[--ca-bundle <value>]
[--cli-read-timeout <value>]
[--cli-connect-timeout <value>]
Options¶
--source (structure)

The S3 bucket that contains the object to sign or a BLOB that contains your raw code.

s3 -> (structure)

The S3Source object.

bucketName -> (string)

Name of the S3 bucket.
key -> (string)

Key name of the bucket object that contains your unsigned code.
version -> (string)

Version of your source image in your version enabled S3 bucket.
Shorthand Syntax:

s3={bucketName=string,key=string,version=string}
JSON Syntax:

{
  "s3": {
    "bucketName": "string",
    "key": "string",
    "version": "string"
  }
}
--destination (structure)

The S3 bucket in which to save your signed object. The destination contains the name of your bucket and an optional prefix.

s3 -> (structure)

The S3Destination object.

bucketName -> (string)

Name of the S3 bucket.
prefix -> (string)

An S3 prefix that you can use to limit responses to those that begin with the specified prefix.
Shorthand Syntax:

s3={bucketName=string,prefix=string}
JSON Syntax:

{
  "s3": {
    "bucketName": "string",
    "prefix": "string"
  }
}
--profile-name (string)

The name of the signing profile.
--client-request-token (string)

String that identifies the signing request. All calls after the first that use this token return the same response as the first call.
--profile-owner (string)

The AWS account ID of the signing profile owner.
--cli-input-json (string) Performs service operation based on the JSON string provided. The JSON string follows the format provided by --generate-cli-skeleton. If other arguments are provided on the command line, the CLI values will override the JSON-provided values. It is not possible to pass arbitrary binary values using a JSON-provided value as the string will be taken literally.

--generate-cli-skeleton (string) Prints a JSON skeleton to standard output without sending an API request. If provided with no value or the value input, prints a sample input JSON that can be used as an argument for --cli-input-json. If provided with the value output, it validates the command inputs and returns a sample output JSON for that command.

Global Options¶
--debug (boolean)

Turn on debug logging.

--endpoint-url (string)

Override command's default URL with the given URL.

--no-verify-ssl (boolean)

By default, the AWS CLI uses SSL when communicating with AWS services. For each SSL connection, the AWS CLI will verify SSL certificates. This option overrides the default behavior of verifying SSL certificates.

--no-paginate (boolean)

Disable automatic pagination. If automatic pagination is disabled, the AWS CLI will only make one call, for the first page of results.

--output (string)

The formatting style for command output.

json
text
table
--query (string)

A JMESPath query to use in filtering the response data.

--profile (string)

Use a specific profile from your credential file.

--region (string)

The region to use. Overrides config/env settings.

--version (string)

Display the version of this tool.

--color (string)

Turn on/off color output.

on
off
auto
--no-sign-request (boolean)

Do not sign requests. Credentials will not be loaded if this argument is provided.

--ca-bundle (string)

The CA certificate bundle to use when verifying SSL certificates. Overrides config/env settings.

--cli-read-timeout (int)

The maximum socket read time in seconds. If the value is set to 0, the socket read will be blocking and not timeout. The default value is 60 seconds.

--cli-connect-timeout (int)

The maximum socket connect time in seconds. If the value is set to 0, the socket connect will be blocking and not timeout. The default value is 60 seconds.

Examples¶
Note
To use the following examples, you must have the AWS CLI installed and configured. See the Getting started guide in the AWS CLI User Guide for more information.

Unless otherwise stated, all examples have unix-like quotation rules. These examples will need to be adapted to your terminal's quoting rules. See Using quotation marks with strings in the AWS CLI User Guide .

To start a signing job

The following start-signing-job example starts a signing job on the code found at the specified source. It uses the specified profile to do the signing and places the signed code in the specified destination.

aws signer start-signing-job \
    --source 's3={bucketName=signer-source,key=MyCode.rb,version=PNyFaUTgsQh5ZdMCcoCe6pT1gOpgB_M4}' \
    --destination 's3={bucketName=signer-destination,prefix=signed-}' \
    --profile-name MyProfile7
The output is the ID of the signing job.

{
    "jobId": "2065c468-73e2-4385-a6c9-0123456789abc"
}
Output¶
jobId -> (string)

The ID of your signing job.
jobOwner -> (string)

The AWS account ID of the signing job owner.