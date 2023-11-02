# The Content Manager

The content-manager is an application with the purpose of allowing Content creators to create content, content reviewers to review the content after a review has being initiated and submitted by the Administrators of the system.

### Authentication service

This service is responsible for Authentication and Authorization and all other services rely on it to generate and verify JWT tokens in order to prevent malicious access to the system.

### Content Manager BFF

This service serve as the backend for frontends. it does so by exposing REST apis which under the wood offload the incoming requests to the respective services and at the same time provides an easy integration point to the frontend.  

### Content service

This service is responsible for Storing as well as managing content that needs to be reviewed by Content reviewers.  

### Notification Service

This micro-service upon receiving an event from the rabit MQ instance sents an email with the link to the document that needs to be reviewed as well as 2 buttons "Approve" and "Reject" to approve or reject the document.

### Review service

This service is in charge of initiating reviews as well as submitting them to the Notification service 

### User service

The User-service serves as a user data management service to the rest of the application

## Running the application

navigate to the each service root directory under services/[service-name]

then run 

`npm install`

`npm run start`

or using docker-compose

navigate to the root directory of the application

and run:

`docker-compose up`

Access the SWAGGER documentation here: http://localhost:3000/api 