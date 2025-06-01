# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript (if needed)
RUN npm run build || true

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
