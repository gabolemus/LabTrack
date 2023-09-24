# Use an official Node runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Copy the current directory contents into the container at /app
COPY . .

# Build the app
RUN yarn build

# Use an official Nginx runtime as a parent image
FROM nginx:1.21.3-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Copy the build output from the previous stage to the Nginx document root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]