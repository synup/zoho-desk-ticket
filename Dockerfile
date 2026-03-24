# Stage 1: Build the widget
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Backend + Frontend
FROM node:20-alpine

# Install nginx to serve the static frontend
RUN apk add --no-cache nginx

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built widget from build stage
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Setup backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ .

# Default CMD is backend; frontend container overrides to nginx
EXPOSE 80 3001
CMD ["node", "index.js"]
