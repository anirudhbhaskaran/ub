# 1. Use official Node.js image for build
FROM node:alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Use a minimal image to serve the built app
FROM node:alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the build output and production dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
