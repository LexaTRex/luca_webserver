FROM node:14.17.3-alpine3.14
WORKDIR /app

ARG NPM_CONFIG__AUTH

COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files && yarn cache clean

RUN mkdir -p ./build
RUN yarn licenses generate-disclaimer > ./licenses-full.txt

ARG GIT_COMMIT
ARG GIT_VERSION
ENV NODE_ENV=production

RUN echo "{\"commit\":\"$GIT_COMMIT\", \"version\":\"$GIT_VERSION\"}" >> ./build/version.json

# install security patches
RUN apk --no-cache add musl=1.2.2-r3

COPY certs/  ./certs/
COPY tsconfig.json .sequelizerc ./
COPY config/  ./config/
COPY src/  ./src/

RUN yarn build
RUN yarn tsconfig-replace-paths --project tsconfig.json

RUN adduser -D worker
USER worker

EXPOSE 8080
CMD ["node", "build/src/index.js"]
