FROM node:18 AS builder

WORKDIR /app
COPY . /app/
RUN yarn && yarn build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf etc/nginx/conf.d/

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
