# Use the official Node.js 20 slim image
FROM node:20-slim

# Install OpenSSL (required by Prisma Client)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for local development)
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy startup script and make it executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the application port
EXPOSE 3001

# Use startup script which runs prisma generate at runtime (when DATABASE_URL is available)
CMD ["/start.sh"]
