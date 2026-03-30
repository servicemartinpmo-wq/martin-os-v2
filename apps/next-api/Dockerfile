FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install deps first for better caching
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build the Next.js app (includes API routes)
RUN npm run build

EXPOSE 3001

# Run only on 3001 (API service behind nginx)
CMD ["npm", "run", "start:api"]
