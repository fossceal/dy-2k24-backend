# Use an official Node.js runtime as the base image
FROM node:lts-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Expose port 3000 for the app to be accessible
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "app.js" ]