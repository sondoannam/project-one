#!/bin/bash
# This script handles the build process on Render

echo "Installing dependencies..."
cd ../..
pnpm install

echo "Generating Prisma client..."
cd apps/server
npx prisma generate

echo "Building application..."
cd ../..
pnpm turbo build --filter=server...

echo "Build completed successfully!"
