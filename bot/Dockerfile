FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY . /app/
WORKDIR /app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

CMD [ "pm2-runtime", "process.config.js" ]
