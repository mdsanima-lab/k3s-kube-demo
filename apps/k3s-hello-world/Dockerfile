# Copyright © 2023 Marcin Różewski MDSANIMA

# Pull node docker image.
FROM node:18.15.0-alpine

# Building app image.
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000

# Run app inside container.
CMD ["npm", "run", "start"]
