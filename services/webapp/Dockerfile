FROM node:14.17.0-alpine3.13 as builder
WORKDIR /app

ARG GIT_COMMIT
ARG GIT_VERSION
ARG NPM_CONFIG__AUTH
ENV NODE_ENV=production
ENV PUBLIC_URL=/webapp


COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files
COPY jsconfig.json craco.config.js ant.theme.js ./
COPY public/  ./public/
COPY src/  ./src/

RUN yarn build

# production container

FROM nginx:1.20.1-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
