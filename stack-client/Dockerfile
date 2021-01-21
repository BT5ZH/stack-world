FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install --legacy-peer-deps --registry=https://registry.npm.taobao.org
COPY . .
RUN npm run build

FROM nginx
EXPOSE 8080
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
