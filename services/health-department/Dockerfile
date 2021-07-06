FROM node:14.17.1-alpine3.13 as builder
WORKDIR /app

ARG GIT_COMMIT
ARG GIT_VERSION
ARG NPM_CONFIG__AUTH
ENV NODE_ENV=production
ENV PUBLIC_URL=/health-department

COPY package.json yarn.lock .npmrc .yarnrc ./
RUN yarn install --production --check-files && yarn cache clean
COPY jsconfig.json craco.config.js ant.theme.js ./
COPY public/  ./public/
COPY src/  ./src/

RUN yarn build

# production container

FROM nginx:1.21.0-alpine

## add permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

# install security patches
RUN apk --no-cache add libcurl=7.77.0-r1
RUN apk --no-cache add curl=7.77.0-r1
RUN apk --no-cache add libxml2=2.9.10-r7
RUN apk --no-cache add libgcrypt=1.8.8-r0
RUN apk --no-cache add musl=1.2.2-r1

## switch to non-root user
USER nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
