# email-service

**Installation guides:**

**1. Environment requirement:**

The environment I used is listed below:

    Node@10.16.0
    NPM@6.9.0
    
**2. Clone code from github**

**3. Update config/config.json with the right credentials**

**4. Run below command to build the project**

    npm run build
  
**5. Start the server**

    node dist/index.js
    
**6. Run below command to run test cases**

    npm test
    
**7. Potential problems during setup**

    Pls make sure you have the right api key for mailgun. If you use sandbox domain, make sure the recipients are all authorized.

**8. Potential improvement in future**

    1. Implement a set of validators and validate the object with them
    2. Credentials can be stored in SSM and download them when server starts.
    3. Authentication can be done by developing a middleware
    4. No user behavior is monitored.
    5. The email will be sent via sendgrid only when api call to mailgun fails. In real life, we can use master-slave policy. Once mailgun becomes unavailable, sendgrid can become master service.
    6. Error handling can be better.
    7. Can write unit test code for each class and each function if required.
    8. sendgrid can only accept 1000 recipients. Have to split recipients to multiple emails and send together.
    

