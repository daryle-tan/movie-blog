FROM node:18 AS build
ARG VITE_OMDB_API_KEY
WORKDIR /app
COPY package*.json ./
# COPY .env .
RUN npm install
COPY . .
RUN echo "VITE_OMDB_API_KEY=$VITE_OMDB_API_KEY" > .env && npm run build  
# RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]