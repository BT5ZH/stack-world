FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install --legacy-peer-deps --registry=https://registry.npm.taobao.org
COPY . .
CMD ["npm", "run", "start"]