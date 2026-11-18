
# --------------------------------
# Stage 1: Frontend Build
# --------------------------------
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build


# --------------------------------
# Stage 2: Backend Production
# --------------------------------
FROM node:22-alpine AS production

WORKDIR /app/backend

ENV NODE_ENV=production

# Backend dependencies
COPY backend/package*.json ./

RUN npm ci --omit=dev

# Backend source code
COPY backend/ ./

# Frontend build files into backend/public
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 5000

# Start backend
CMD ["node", "src/index.js"]
