FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install -g nodemon webpack yarn
RUN yarn

# Bundle app source
COPY . /app

EXPOSE 5000
