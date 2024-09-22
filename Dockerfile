# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the NestJS application using local Nest CLI
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --frozen-lockfile --production

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Command to run the NestJS application
CMD ["node", "dist/main"]

