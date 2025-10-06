#!/bin/bash

# 🚀 Livets Stemme - Vercel Deployment Script
echo "🎙️ Deploying Livets Stemme to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Kjør dette scriptet fra prosjektets hovedmappe (der package.json er)"
    exit 1
fi

print_step "Sjekker forutsetninger..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI ikke funnet. Installerer..."
    npm install -g vercel
fi

# Check if bun is available
if ! command -v bun &> /dev/null; then
    print_warning "Bun ikke funnet. Bruker npm i stedet..."
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="bun"
fi

print_success "Alle verktøy er klare"

print_step "Installerer dependencies..."
$PACKAGE_MANAGER install

print_step "Tester at prosjektet bygger..."
if $PACKAGE_MANAGER run build; then
    print_success "Build test passerte"
else
    print_error "Build feilet. Fix feilene før deployment."
    exit 1
fi

print_step "Sjekker git status..."
if git diff --quiet && git diff --staged --quiet; then
    print_success "Alle endringer er committet"
else
    print_warning "Du har uncommittede endringer."
    echo "Vil du committe dem nå? (y/N)"
    read -r REPLY
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        echo "Skriv commit melding:"
        read -r COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        print_success "Endringer committet"
    else
        print_warning "Fortsetter uten å committe..."
    fi
fi

print_step "Starter Vercel deployment..."

echo
echo "🔧 Environment Variables sjekkliste:"
echo "Før du fortsetter, sørg for at du har satt disse i Vercel:"
echo
echo "📋 Påkrevde:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL (settes automatisk av Vercel)"
echo
echo "🎯 Valgfrie (for full funksjonalitet):"
echo "   - OPENAI_API_KEY (for AI historieforslag)"
echo "   - ELEVENLABS_API_KEY (for stemmekloning)"
echo "   - STRIPE_SECRET_KEY (for betalinger)"
echo
echo "Har du satt environment variables i Vercel? (y/N)"
read -r ENV_READY

if [[ ! $ENV_READY =~ ^[Yy]$ ]]; then
    echo
    print_warning "Sett environment variables i Vercel først:"
    echo "1. Gå til vercel.com/dashboard"
    echo "2. Velg ditt prosjekt"
    echo "3. Settings → Environment Variables"
    echo "4. Legg til variablene over"
    echo "5. Kjør dette scriptet igjen"
    echo
    echo "📖 Full guide: VERCEL_IMPLEMENTERING_OPPSKRIFT.md"
    exit 1
fi

# Deploy to Vercel
echo
print_step "Deployer til Vercel..."

# First time deployment
if ! vercel ls | grep -q "$(basename "$PWD")"; then
    print_step "Første gang deployment - setter opp prosjekt..."
    vercel --yes
else
    print_step "Deployer oppdatering..."
    vercel --prod
fi

if [ $? -eq 0 ]; then
    print_success "Deployment fullført!"

    # Get deployment URL
    DEPLOY_URL=$(vercel ls | grep "$(basename "$PWD")" | head -1 | awk '{print $2}')

    if [ ! -z "$DEPLOY_URL" ]; then
        echo
        print_success "🌍 Din app er live på: https://$DEPLOY_URL"
        echo
        print_step "Testing deployment..."

        # Test health endpoint
        if curl -f "https://$DEPLOY_URL/api/health" > /dev/null 2>&1; then
            print_success "Health check passerte"
        else
            print_warning "Health check feilet - sjekk environment variables"
        fi

        echo
        echo "🎯 Neste steg:"
        echo "1. Test appen: https://$DEPLOY_URL"
        echo "2. Gå til /admin/vercel-status for full status"
        echo "3. Test registrering med ekte e-post"
        echo "4. Sjekk Supabase auth settings hvis problemer"
        echo
        echo "📚 Full testing guide: VERCEL_IMPLEMENTERING_OPPSKRIFT.md"

    fi
else
    print_error "Deployment feilet!"
    echo
    echo "🔧 Vanlige løsninger:"
    echo "1. Sjekk environment variables i Vercel dashboard"
    echo "2. Verifiser at build fungerer lokalt: $PACKAGE_MANAGER run build"
    echo "3. Sjekk Vercel logs: vercel logs"
    echo
    exit 1
fi

print_success "🎉 Livets Stemme er nå live på Vercel! 🇳🇴"
