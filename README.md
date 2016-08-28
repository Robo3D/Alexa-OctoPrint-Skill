# Alexa-OctoPi
Control OctroPi with Alexa Skills Kit and AWS Lambda

# Configuration
- Inside 'lambda/index.js' replace OCTO_KEY with the API key found in your OctoPrint Settings
- Be sure to ENABLE Auths (change default username / password) in OctoPrint 
- Forward OctoPrint's IP out on port 80
- Replace OCTO_PATH with the outward facing IP address or nameserver.
- Zip 'lambda/index.js' & 'lambda/AlexaSkill.js'
- Upload the Zip to the Lambda Server
