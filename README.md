# HTF25 - The Serverless Quest Beneath the Surface

The Earth is receiving mysterious sonar signals from an uncharted deep-sea region.  
Your team is deployed with an underwater drone, connected to an intelligent serverless observation platform.  
Explore the zone and respond in real time to everything you encounter — from detecting rare sea creatures to evading underwater threats.

![HTF-2025-Architecture](img/HTF-2025-Architecture.png)

All components outlined with a rectangle are already provided for you to save some time, but you will need them. The other components require setup, configuration or integration from your end.

---

## Requirements
### Install AWS CLI
In order to be able to communicate with the AWS cloud, you need to install its CLI.  
The installation file can be found here:
- [Windows](https://awscli.amazonaws.com/AWSCLIV2.msi)
- [MacOS](https://awscli.amazonaws.com/AWSCLIV2.pkg)
- [Linux](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-install)

#### Configure AWS CLI
You'll need to login using your credentials in order to be able to use the AWS CLI.  
The credentials have beent sent to your school email.  
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html

### Install AWS SAM
The AWS SAM (Serverless Application Model) makes it easier to create and manage serverless applications in the AWS cloud.  
This is not a necessity, but can improve the speed and quality of building your applications.

The installation guide can be found here:
- [Windows](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-windows.html)
- [MacOS](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)
- [Linux](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-linux.html)

### Install NodeJS and NPM
[NodeJS Download](https://nodejs.org/en/download/)  

---

## Getting started
### Initial Setup
In order to be able to deploy your project to AWS, you'll need to set a few parameters.

#### deployStudent.sh and deployStudent.ps1
Replace **[TEAMNAME]** with the name of your team excluding spaces.  
Example: "Hack Tuah" becomes "HackTuah".

List:
- GoPowerRanger
- Hydra
- MaranzasDiBrugge
- OTR
- Samoth
- SecurityMobistar
- SuperHacker
- WeCantC

#### cfn-students.yml
At the top of the files, there is a parameter called "TeamName", enter your team name in the *Default* attribute (excluding spaces).  
Example: "Hack Tuah" becomes "HackTuah".

### General Notice
Because this is a hackathon, keep in mind that we are using free tiers of many of the tools that you will be integrating with.  
This means that rate limits are often applied if you send requests too often.  
It is advised to be careful with loops or short intervals on your scheduled requests.  
It is also smart that each teammember creates accounts on these tools and already saves credentials, so you can swap easily if rate limits have been hit.  
This way you will lose the least amount of time during the hackathon.

---

### Levels

After finishing a level, give the judges a notice. That way they can keep track of who's first

#### Level 1 - [Sonar Signal Classifier](./src/fn-signal-classifier/README.md)
Ingest ingcoming EventBridge events containing sonar observations. Validate required fields, classify each event, and publishes to the appropriate **SNS** topic.

#### Level 2 & 3 - [Sonar Observation Ingest](./src/fn-observation-ingest/README.md)
Ingest **SNS** messages containing sonar events and write them to the correct destination.

#### Level 4 - [Dark Signal Decipherer](./src/fn-dark-signal-decipherer/README.md)
Ingest ingests **SNS** messages that may contain **dark signals**. Decode and **decipher** them using a monoalphabetic substitution key, and forwards the plaintext to an **SQS** queue.

#### Level 5 - [Sonar Message Translator](./src/fn-message-translator/README.md)
Read and translate the Dark Messages. Then POST them to via webhook to a platform of your choosing

---

## Best Practices
### Local development (Only if Docker is installed)
```bash
# Install required NPM packages
cd src/fn-dark-signal-decipherer
npm install
cd ../fn-message-translator
npm install
cd ../fn-observation-ingest
npm install
cd ../fn-signal-classifier
npm install
cd ..

# Execute function locally (only if Docker is installed)
sam local invoke Challenge1Lambda --event ./payloads/signal-classifier.json -t cfn-students.yaml

sam local invoke Challenge2Lambda --event ./payloads/observation-ingest.json -t cfn-students.yaml

sam local invoke Challenge4Lambda --event ./payloads/dark-signal-decipherer.json -t cfn-students.yaml

sam local invoke Challenge5Lambda --event ./payloads/message-translator.json -t cfn-students.yaml

# Deploy Project to AWS using bash or git bash/wsl on windows
bash deployStudent.sh
```
