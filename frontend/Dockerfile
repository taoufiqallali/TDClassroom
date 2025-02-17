# Base image for Node.js
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy project files
COPY . .

# Expose the port
EXPOSE 4200

# Start Angular app
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
