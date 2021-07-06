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

COPY /src/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 8080
