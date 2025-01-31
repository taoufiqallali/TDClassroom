# Base image for Node.js
FROM node:alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Create a new Angular project
RUN ng new my-angular-app --defaults --skip-git
WORKDIR /app/my-angular-app

# Add Angular Material to the project
RUN ng add @angular/material --defaults

# Copy source code for live updates
# COPY . .
# This is commented to allow for changes in code to directly apply to the container

# Expose the port used by ng serve
EXPOSE 4200

# Default command: Use ng serve for development
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]