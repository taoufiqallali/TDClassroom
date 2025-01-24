# Base image for Node.js
FROM node:alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code for live updates
COPY . .

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose the port used by ng serve
EXPOSE 4200

# Default command: Use ng serve for development
CMD ["ng", "serve", "--host", "0.0.0.0"]
