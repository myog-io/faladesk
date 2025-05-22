# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy frontend source
COPY web/package.json ./web/package.json
COPY web/tsconfig.json ./web/tsconfig.json
COPY web/vite.config.ts ./web/vite.config.ts
COPY web/nginx.conf ./web/nginx.conf
COPY web/index.html ./web/index.html
COPY web/src ./web/src

# Pass Supabase env vars as build args
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN cd web && npm install && npm run build

# Production stage
FROM nginx:1.25-alpine
COPY --from=build /app/web/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
