FROM node:11

LABEL maintainer="github.com/vadirn" name="starter-pack" version="v0.0.10"

EXPOSE 5001

WORKDIR /home/node/app
COPY . /home/node/app

RUN yarn install && \
    node build

CMD yarn start