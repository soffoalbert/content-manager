# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install NestJS application dependencies
RUN yarn install


# Copy the rest of the application code to the container
COPY . .

# Copy the tsconfig.json file into the container
COPY tsconfig.json ./ 
 
RUN yarn build

# Expose port 3002 (the same port your NestJS app is listening on)
EXPOSE 3003

# Define the command to start your NestJS application
CMD [ "node", "dist/main" ]
