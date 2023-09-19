# Copyright © 2023 MDSANIMA

# Pull the Node Docker image.
FROM node:20.6.1-alpine

# Building the application image.
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000

# Running the application inside a container.
CMD ["npm", "run", "start"]
