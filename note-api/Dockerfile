# 阶段1：构建 Nest.js 应用
FROM node:14 AS build
WORKDIR /app
COPY . /app 
RUN npm i pnpm -g
RUN pnpm i
RUN pnpm run build

# 阶段2：创建最终镜像
FROM node:14
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["npm", "run", "start:prod"]
