# Amazon Alexa + OctoPi
A simple [AWS Lambda](http://aws.amazon.com/lambda) function that uses the Alexa SDK to control OctoPi.

## Concepts
This proof of concept has no external dependencies or session management, and shows the most basic usage for handling Alexa Skill requests then posting JSON data to a server.

## Setup
To run this skill you need to do a few setup things. The first is to deploy the example code in lambda, and the second is to configure the Alexa skill to use Lambda.
On your OctoPi machine you will need to forward the ports outward. (Highly recommend setting a username / password that is not default)

### AWS Lambda Setup
1. Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
2. Click on the Create a Lambda Function or Get Started Now button.
3. Skip the blueprint
4. Name the Lambda Function "Alexa-OctoPi".
5. Select the runtime as Node.js
5. Go to the the src directory, select the index.js file, enter the forwarded address from your OctoPi machine (i.e. 100.92.100.54) for the variable OCTO_PATH.
6. Back at the src directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
6. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
7. Keep the Handler as index.handler (this refers to the main js file in the zip).
8. Create a basic execution role and click create.
9. Leave the Advanced settings as the defaults.
10. Click "Next" and review the settings then click "Create Function"
11. Click the "Event Sources" tab and select "Add event source"
12. Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
13. Copy the ARN from the top right to be used later in the Alexa Skill Setup

### Alexa Skill Setup
1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click Add a New Skill.
2. Set "OctoPi" as the skill name and "Octo Print" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, ask Octo Print for the printer status"
3. Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the Intent Schema from the included IntentSchema.json.
5. Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
6. [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID,
   then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source. (Again, highly recommend this)
7. You are now able to start testing your sample skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
8. In order to test it, try to say some of the Sample Utterances from the Examples section below.
9. Your skill is now saved and once you are finished testing you can continue to publish your skill.

## Examples
    User: "Alexa, ask Octo Print for the printer status."
    Alexa: "Printer is not operational."
    
## Recources
