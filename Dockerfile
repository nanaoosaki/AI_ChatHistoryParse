# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install wrangler globally
RUN npm install -g wrangler@latest

# Copy project files
COPY . .

# Expose ports
EXPOSE 8787 5173

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]

