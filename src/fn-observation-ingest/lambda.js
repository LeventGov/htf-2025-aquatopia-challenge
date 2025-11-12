// Recommended Packages for this Lambda
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { Client } = require("@opensearch-project/opensearch");
const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");
const AWSXRay = require('aws-xray-sdk-core');
const { time } = require("console");
const { type } = require("os");
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

const openSearchEndpoint = "https://s6tkjpxuugo2q82i4z3d.eu-central-1.aoss.amazonaws.com";

const osClient = new Client({
    ...AwsSigv4Signer({
        region: "eu-central-1",
        service: 'aoss', // 'es' for managed, 'aoss' for serverless
        getCredentials: defaultProvider(),
    }),
    node: openSearchEndpoint,
});

const dynamoClient = AWSXRay.captureAWSv3Client(new DynamoDBClient());

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    // Check where it should be stored
    let type = event["type"]
    if (type === "observation" || type === "rare-observation") {
        // Insert into DynamoDB
        await insertIntoDynamoDB(event);
    }
    else if (type === "alert") {
        // Insert into OpenSearch
        await insertIntoOpenSearch(event);
    }

    // Call the correct message
    return { statusCode: 200, body: "Data processed successfully" };
}

async function insertIntoDynamoDB(message) {
    // Format the message for DynamoDB parameters (check README for indexes)    
    let originalPayload = message.originalPayload;
    let detail = originalPayload["detail"];
    let dbObject = {
        id: originalPayload.id,
        team: "htf-Hydra",
        species: detail.species,
        location: detail.location,
        intensity: detail.intensity,
        timestamp: new Date().toISOString(),
        type: detail.type,
    };

    const params = {
    TableName: "htf-2025-sonar-observations",
    Item: dbObject,
    ConditionExpression: 'attribute_not_exists(id)',
    };

    // Use the `dynamoClient` to insert the record into DynamoDB
    try {
    await dynamoClient.send(new PutCommand(params));
    console.log(`Inserted event ${dbObject.id} into DynamoDB`);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log(`Duplicate event ${dbObject.id} ignored`);
    } else {
      throw error;
    }
  }
}

async function insertIntoOpenSearch(message) {
    // Format the message for OpenSearch parameters (check README for indexes)
    let originalPayload = message.originalPayload;
    let detail = originalPayload["detail"];
    let osObject = {
        id: originalPayload.id,
        team:"Hydra",
        species: detail.species,
        location: detail.location,
        type: detail.type,
        intensity: detail.intensity,
        timestamp: new Date().toISOString()
    };
    // Use the `osClient` to insert the record into OpenSearch
}
