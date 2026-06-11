# Use the official lightweight Bun image
FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package configurations first to leverage Docker layer caching
COPY package.json bun.lock* ./

# Install dependencies using Bun's lightning-fast native installer
RUN bun install

# Copy the rest of your application files
COPY . .

# Expose the default Next.js development server port
EXPOSE 3000

# Run the project using Bun's native dev process runner
CMD ["bun", "run", "dev"]
