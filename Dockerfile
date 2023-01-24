FROM nginx
ADD build /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf etc/nginx/conf.d/

# Start Nginx server
CMD ["/bin/bash", "nginx -g \"daemon off;\""]
