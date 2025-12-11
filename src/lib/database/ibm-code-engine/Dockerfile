# IBM Code Engine Dockerfile for HBF Capital API
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY *.ts ./

# Install dev dependencies for build
RUN npm install typescript @types/node @types/express @types/pg @types/cors @types/jsonwebtoken

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the server
CMD ["node", "dist/server-entry.js"]
