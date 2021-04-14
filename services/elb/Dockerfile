FROM nginx:1.19.9-alpine

## add permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

## switch to non-root user
USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY shared /etc/nginx/shared
COPY ssl /etc/nginx/ssl

EXPOSE 8080
EXPOSE 8443
CMD ["nginx", "-g", "daemon off;"]
