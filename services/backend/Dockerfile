FROM node:14.17.3-alpine3.14 as builder
WORKDIR /app
ENV NODE_ENV=production

# install dependencies
ARG NPM_CONFIG__AUTH
COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files && yarn cache clean

# copy source files
COPY tsconfig.json ./
COPY src/  ./src/

# build
ARG GIT_COMMIT
ARG GIT_VERSION
RUN yarn --silent licenses generate-disclaimer > licenses.txt
RUN yarn build

FROM node:14.17.3-alpine3.14
WORKDIR /app
ENV NODE_ENV=production

# set timezone
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# copy build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/src /app/src
COPY --from=builder /app/build /app/build
COPY --from=builder /app/licenses.txt /app/licenses.txt
COPY --from=builder /app/version.json /app/version.json

# copy aux files
COPY .sequelizerc package.json ./
COPY config/ ./config/
COPY certs/  ./certs/

# change user
RUN adduser -D worker
USER worker

# expose ports
EXPOSE 8080
CMD ["node", "build/src/index.js"]
