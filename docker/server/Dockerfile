FROM node:lts

WORKDIR /usr/src/server

COPY ./ ./

EXPOSE 3000
RUN npm install
RUN npm install pm2

CMD ["/bin/bash"]