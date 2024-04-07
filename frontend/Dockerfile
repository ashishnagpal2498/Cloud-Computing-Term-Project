# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

ENV REACT_APP_ENVIRONMENT=production
ENV REACT_APP_FRONTEND_URL=localhost
ENV REACT_APP_BACKEND_URL=localhost

# Build the React app
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
