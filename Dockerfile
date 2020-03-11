FROM node:8.12
COPY . /app
WORKDIR /app

ADD package.json /app/

RUN npm install

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

# web server config
EXPOSE 5233

CMD [ "node", "app.js"]