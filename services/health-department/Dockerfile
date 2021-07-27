FROM node:14.17.1-alpine3.13 as builder
WORKDIR /app

ARG NPM_CONFIG__AUTH

COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files && yarn cache clean
COPY jsconfig.json craco.config.js ant.theme.js ./
COPY public/  ./public/
COPY src/  ./src/

ARG GIT_COMMIT
ARG GIT_VERSION
ENV NODE_ENV=production
ENV PUBLIC_URL=/health-department

RUN yarn build

# production container

FROM nginx:1.21.1-alpine

## add permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

# install security patches
RUN apk --no-cache add libcurl=7.78.0-r0
RUN apk --no-cache add curl=7.78.0-r0
RUN apk --no-cache add libxml2=2.9.12-r1
RUN apk --no-cache add libgcrypt=1.9.3-r0
RUN apk --no-cache add musl=1.2.2-r3

## switch to non-root user
USER nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
