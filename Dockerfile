# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the production assets using NGINX
FROM nginx:alpine
# Copy custom nginx config to handle React Router client-side routes cleanly
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]