# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Accept VITE_API_URL as a build argument so it is injected into the production build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build for production
RUN npm run build

# Stage 2: Serve using NGINX
FROM nginx:alpine

# Copy the custom Nginx template
# Nginx >= 1.19 directly processes .template files with envsubst
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy the built application from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run injects the PORT environment variable natively
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
