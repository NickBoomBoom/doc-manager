FROM node:18-alpine as builder
WORKDIR /build
COPY . /build
RUN npm i pnpm -g
RUN pnpm i
RUN pnpm run build:spa
FROM nginx:latest
# 复制你的 Vue.js SPA 静态文件到 Nginx 静态文件目录
COPY --from=builder /build/dist/spa /usr/share/nginx/html
# 暴露容器监听的端口（Nginx 默认端口为 80）
EXPOSE 80

