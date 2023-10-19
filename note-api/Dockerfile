FROM node:18-alpine as builder
WORKDIR /build
COPY . /build
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm build
RUN ls -l /build

FROM node:18-alpine 
WORKDIR /app
COPY --from=builder /build/dist /app
CMD ["node", "/app/main.js"]
EXPOSE 3000
 
