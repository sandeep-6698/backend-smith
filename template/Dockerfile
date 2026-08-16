# Use the official Node.js 20.x image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app/backend

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on (change if necessary)
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "prod"]
