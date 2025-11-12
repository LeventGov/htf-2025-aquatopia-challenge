#!/bin/bash
STACK_NAME="HTF25-Hydra"
MY_REGION="eu-central-1"
MY_DEV_BUCKET="htf25-cfn-bucket"

AWS_PROFILE="default"

# Package the cloudformation package
aws cloudformation package --template ./cfn-students.yaml --s3-bucket $MY_DEV_BUCKET --output-template ./cfn-students-export.yaml

# Deploy the package
sam deploy --template-file ./cfn-students-export.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --region $MY_REGION