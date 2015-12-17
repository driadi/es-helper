S3_LOCATION=${1-s3://dev-lib.thehive.com/js}
aws s3 cp ./dist/ $S3_LOCATION --recursive --region us-west-1