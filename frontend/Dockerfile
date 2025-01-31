# Base image for Node.js
FROM node:alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

RUN npx ng add @angular/material --skip-confirmation
# Copy source code for live updates
#COPY . .
# this is commented to allow for changes in code to directly apply to container

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose the port used by ng serve
EXPOSE 4200

# Default command: Use ng serve for development
CMD ["ng", "serve", "--host", "0.0.0.0" , "--poll" , "2000"]
