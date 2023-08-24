FROM node:16.11.1-alpine

WORKDIR /app

COPY package*.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY . .

# Build for production.
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

# Uses port which is used by the actual application
EXPOSE 3000

# Run application
#CMD [ "npm", "start" ]
CMD serve -s -p 3000 --ssl-cert ./certs/hyperfei.crt --ssl-key ./certs/hyperfei.key --no-clipboard build 