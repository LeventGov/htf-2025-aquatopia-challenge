Param(
    [string]$STACK_NAME = "HTF25-Hydra",
    [string]$MY_REGION = "eu-central-1",
    [string]$MY_DEV_BUCKET = "htf25-cfn-bucket",
    [string]$AWS_PROFILE = "default",
    [string]$TEMPLATE = ".\cfn-students.yaml",
    [string]$OUTPUT_TEMPLATE = ".\cfn-students-export.yaml"
)

$ErrorActionPreference = 'Stop'

# Gebruik aangegeven AWS profiel voor deze sessie
$env:AWS_PROFILE = $AWS_PROFILE

Write-Host "Packaging CloudFormation template..."
aws cloudformation package --template-file $TEMPLATE --s3-bucket $MY_DEV_BUCKET --output-template-file $OUTPUT_TEMPLATE

Write-Host "Deploying stack '$STACK_NAME' to region '$MY_REGION'..."
sam deploy --template-file $OUTPUT_TEMPLATE --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --region $MY_REGION