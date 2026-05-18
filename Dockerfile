# --- Stage 1: Development / Base ---
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including devDependencies (needed for start:dev watch mode)
RUN npm install --legacy-peer-deps

COPY . .

# Default command for development stage
CMD ["npm", "run", "start:dev"]

# --- Stage 2: Production Build ---
FROM development AS builder

# Build the TypeScript project
RUN npm run build

# Prune devDependencies to keep the production image lightweight
RUN npm prune --production

# --- Stage 3: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy compiled files and production node_modules from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the default NestJS port
EXPOSE 3000

# Start the NestJS application in production mode
CMD ["node", "dist/main"]
