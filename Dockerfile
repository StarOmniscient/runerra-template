FROM node:25-bullseye-slim

LABEL authors="Hakushi"
WORKDIR /application

ENV NODE_ENV=production 

# NEXTAUTH
ENV NEXTAUTH_SECRET=""
ENV NEXTAUTH_URL=""

# DATABASE
ENV DB_HOST=""
ENV DB_USER=""
ENV DB_PASSWORD=""
ENV DB_DATABASE=""
ENV DB_TYPE="mysql"
ENV DATABASE_URL="${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}"

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Prisma setup
RUN pnpx prisma migrate deploy
RUN pnpx prisma generate

# Build Next.js app
RUN pnpm run build

CMD ["pnpm", "start"]
