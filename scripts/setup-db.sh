#!/bin/bash

# Database Setup Script
# This script sets up the database for the supplement review site

set -e

echo "🚀 Setting up database..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your DATABASE_URL and AUTH_SECRET"
    echo "   Then run this script again."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local || grep -q "postgresql://user:password@" .env.local; then
    echo "⚠️  DATABASE_URL not configured in .env.local"
    echo "   Please set your database connection string"
    exit 1
fi

# Check if AUTH_SECRET is set
if ! grep -q "AUTH_SECRET=" .env.local || grep -q "your-super-secret-key" .env.local; then
    echo "⚠️  AUTH_SECRET not configured in .env.local"
    echo "   Generate one with: openssl rand -base64 32"
    exit 1
fi

echo "✅ Environment variables configured"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Push schema to database
echo "📊 Pushing database schema..."
pnpm db:push

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm db:generate

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Start dev server: pnpm dev"
echo "   2. Login to admin: http://localhost:3000/admin/login"
echo "   3. Username: admin"
echo "   4. Password: admin123"
echo "   5. Change credentials immediately!"
echo ""

