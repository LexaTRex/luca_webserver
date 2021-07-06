FROM node:14.17.1-alpine3.13
WORKDIR /app

ARG GIT_COMMIT
ARG GIT_VERSION
ARG NPM_CONFIG__AUTH
ENV NODE_ENV=production

COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files && yarn cache clean
RUN yarn licenses generate-disclaimer > ./licenses-full.txt
RUN echo "{\"commit\":\"$GIT_COMMIT\", \"version\":\"$GIT_VERSION\"}" >> version.json

# install security patches
RUN apk --no-cache add musl=1.2.2-r1

RUN adduser -D worker
USER worker

COPY .sequelizerc ./
COPY config/  ./config/
COPY src/  ./src/

EXPOSE 8080
CMD ["node", "src"]
