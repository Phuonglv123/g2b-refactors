FROM node:18-alpine as common-build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json yarn.lock ./

# Install the project dependencies
RUN yarn install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the production-ready code
RUN yarn build

# Expose the port that the application will run on
EXPOSE 8000

# Development build stage
FROM common-build-stage as development-build-client

ENV NODE_ENV development

CMD ["yarn", "dev"]

