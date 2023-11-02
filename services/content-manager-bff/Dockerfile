# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN yarn global add @nestjs/cli

# Install NestJS application dependencies
RUN yarn install --only=development

# Copy the rest of the application code to the container
COPY . .

# Copy the tsconfig.json file into the container
COPY tsconfig.json ./  

# Expose port 3002 (the same port your NestJS app is listening on)
EXPOSE 3000

# Define the command to start your NestJS application
CMD [ "yarn", "start" ]
