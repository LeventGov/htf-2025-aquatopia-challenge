// Recommended Packages for this Lambda
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const AWSXRay = require('aws-xray-sdk-core');

// SNS to send messages to
const snsArn = process.env.SNSArn;

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    // Determine if the message is a dark signal or not
    let isDark;
    isDark = determineSignal(event);

    let messageToSend;

    if (!isDark) {
        // Create correct message
        messageToSend = createMessage(event["detail"]);
    } else {
        // Create correct message
        messageToSend = {
            "type": "dark-signal",
            "originalPayload": { detail: event["detail"] }
        };
    }

    console.log(JSON.stringify(messageToSend))
    // Send to SNS
    messageToSend != null ? await sendToSNS(messageToSend) : null;
}

function createMessage(detail) {
    let type = detail["type"];
    let intensity = detail["intensity"];

    if (type === "creature") {
        if (intensity < 3) {
            return {
                "type": "observation",
                "originalPayload": { detail: detail }
            };
        } else if (intensity >= 3) {
            return {
                "type": "rare-observation",
                "originalPayload": { detail: detail }
            };
        }
    }
    else if (type === "hazard" && intensity >= 2) {
        return {
            "type": "alert",
            "originalPayload": { detail: detail }
        }
    }
    else if (type === "anomaly" && intensity >= 2) {
        return {
            "type": "alert",
            "originalPayload": { detail: detail }
        }
    }

    return {
        "type": "observation",
        "originalPayload": { detail: detail }
    }
}

function determineSignal(message) {
    // Return the correct signal-type
    let detail = message["detail"];
    let detailType = message["detail-type"];

    if (detailType === "dark-signal" || detail == { data: "..." }) {
        return true;
    }

    return false;
}

async function sendToSNS(message) {
    console.log(message);

    // Client to be used
    const snsClient = AWSXRay.captureAWSv3Client(new SNSClient());

    // Setup parameters for SNS
    let params = {
        TopicArn: snsArn,
        Message: JSON.stringify(message),
    };

    // Get a response
    try {
        const command = new PublishCommand(params);
        const response = await snsClient.send(command);

        console.log("Message sent to SNS:", response);
        return response;
    } catch (error) {
        console.error("Error sending message to SNS:", error);
        throw error;
    }
    //let response;

    // Just to check if it worked
    //console.log(response);
}
