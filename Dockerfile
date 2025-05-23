# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy frontend source
COPY web/package.json ./web/package.json
COPY web/package-lock.json ./web/package-lock.json
WORKDIR /app/web
RUN npm install -g expo-cli
RUN yanr install
COPY web .

# Pass Supabase env vars as build args
ARG EXPO_PUBLIC_SUPABASE_URL
ARG EXPO_PUBLIC_SUPABASE_ANON_KEY
ENV EXPO_PUBLIC_SUPABASE_URL=$EXPO_PUBLIC_SUPABASE_URL
ENV EXPO_PUBLIC_SUPABASE_ANON_KEY=$EXPO_PUBLIC_SUPABASE_ANON_KEY

RUN npx expo export --platform web

# Production stage
FROM nginx:1.25-alpine
COPY --from=build /app/web/web-build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
