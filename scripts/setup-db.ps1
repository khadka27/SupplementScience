# Database Setup Script for Windows PowerShell
# This script sets up the database for the supplement review site

Write-Host "🚀 Setting up database..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "⚠️  Please edit .env.local and add your DATABASE_URL and AUTH_SECRET" -ForegroundColor Yellow
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content .env.local -Raw
if ($envContent -notmatch "DATABASE_URL=" -or $envContent -match "postgresql://user:password@") {
    Write-Host "⚠️  DATABASE_URL not configured in .env.local" -ForegroundColor Yellow
    Write-Host "   Please set your database connection string" -ForegroundColor Yellow
    exit 1
}

# Check if AUTH_SECRET is set
if ($envContent -notmatch "AUTH_SECRET=" -or $envContent -match "your-super-secret-key") {
    Write-Host "⚠️  AUTH_SECRET not configured in .env.local" -ForegroundColor Yellow
    Write-Host "   Generate one with: openssl rand -base64 32" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Install dependencies if needed
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    pnpm install
}

# Push schema to database
Write-Host "📊 Pushing database schema..." -ForegroundColor Cyan
pnpm db:push

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
pnpm db:generate

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
pnpm db:seed

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start dev server: pnpm dev"
Write-Host "   2. Login to admin: http://localhost:3000/admin/login"
Write-Host "   3. Username: admin"
Write-Host "   4. Password: admin123"
Write-Host "   5. Change credentials immediately!"
Write-Host ""

