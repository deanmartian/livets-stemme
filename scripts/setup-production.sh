#!/bin/bash

# 🚀 Livets Stemme - Production Setup Script
echo "🎙️ Setting up Livets Stemme for production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo "🔍 Checking required tools..."

if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun is not installed. Please install Bun first.${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required tools are installed${NC}"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Please edit .env.local with your actual values${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Run type check
echo "🔍 Running type check..."
if bun run type-check; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${RED}❌ Type check failed. Please fix TypeScript errors.${NC}"
    exit 1
fi

# Run linting
echo "🔍 Running linter..."
if bun run lint; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  Linting issues found. Run 'bun run lint:fix' to auto-fix.${NC}"
fi

# Build project
echo "🏗️  Building project..."
if bun run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix build errors.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Set up Supabase project (see VERCEL_DEPLOYMENT.md)"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Deploy to Vercel:"
echo "   - Via CLI: npx vercel"
echo "   - Via GitHub: Connect repository at vercel.com"
echo ""
echo "📚 Full deployment guide: VERCEL_DEPLOYMENT.md"
echo ""
echo -e "${YELLOW}🔗 Current demo: https://same-qwc8draomtn-latest.netlify.app${NC}"
