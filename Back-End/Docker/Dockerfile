FROM node:18-alpine

# Set the timezone
ENV TZ=America/Guatemala

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY . .

RUN yarn tsc -p .

CMD ["node", "dist/app.js"]
