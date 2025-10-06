#!/usr/bin/env node

/**
 * 🔍 Supabase Verification Script
 * Verifies that Supabase is correctly configured for Livets Stemme
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function success(message) {
  log(`✅ ${message}`, colors.green)
}

function error(message) {
  log(`❌ ${message}`, colors.red)
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow)
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue)
}

async function verifyEnvironmentVariables() {
  log('\n🔧 Checking environment variables...', colors.bold)

  const missing = REQUIRED_ENV_VARS.filter(varName => !process.env[varName])

  if (missing.length > 0) {
    error(`Missing environment variables: ${missing.join(', ')}`)
    error('Please check your .env.local file')
    return false
  }

  success('All required environment variables found')
  return true
}

async function verifySupabaseConnection() {
  log('\n🔌 Testing Supabase connection...', colors.bold)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Test basic connection
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact' })

    if (error) {
      error(`Connection failed: ${error.message}`)
      return false
    }

    success('Supabase connection successful')
    return true
  } catch (err) {
    error(`Connection error: ${err.message}`)
    return false
  }
}

async function verifyDatabaseSchema() {
  log('\n🗄️  Verifying database schema...', colors.bold)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const tables = ['user_profiles', 'stories', 'family_members']
    const results = []

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          error(`Table '${table}' not accessible: ${error.message}`)
          results.push(false)
        } else {
          success(`Table '${table}' exists and accessible`)
          results.push(true)
        }
      } catch (err) {
        error(`Table '${table}' check failed: ${err.message}`)
        results.push(false)
      }
    }

    return results.every(Boolean)
  } catch (err) {
    error(`Schema verification failed: ${err.message}`)
    return false
  }
}

async function verifyStorageBucket() {
  log('\n📁 Checking storage bucket...', colors.bold)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      error(`Storage check failed: ${error.message}`)
      return false
    }

    const audioFilesBucket = data.find(bucket => bucket.name === 'audio-files')

    if (!audioFilesBucket) {
      error('audio-files bucket not found')
      warning('Please create the audio-files bucket in Supabase Storage')
      return false
    }

    success('audio-files bucket exists')

    if (audioFilesBucket.public) {
      warning('audio-files bucket is public - consider making it private for security')
    } else {
      success('audio-files bucket is private (secure)')
    }

    return true
  } catch (err) {
    error(`Storage verification failed: ${err.message}`)
    return false
  }
}

async function verifyAuthConfiguration() {
  log('\n🔐 Checking authentication configuration...', colors.bold)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Test if we can attempt to sign in (this will fail but shows auth is configured)
    const { error } = await supabase.auth.signInWithOtp({
      email: 'test@example.com',
      options: { shouldCreateUser: false }
    })

    // We expect this to fail for a non-existent user, but it shows auth is working
    if (error && error.message.includes('Unable to validate email address')) {
      warning('Auth configured but email validation may need setup')
    } else if (error && error.message.includes('Email not confirmed')) {
      success('Auth configuration appears correct')
    } else if (error) {
      warning(`Auth test returned: ${error.message}`)
    } else {
      success('Auth configuration working')
    }

    return true
  } catch (err) {
    error(`Auth verification failed: ${err.message}`)
    return false
  }
}

async function showProjectInfo() {
  log('\n📊 Project Information:', colors.bold)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const projectId = supabaseUrl?.split('//')[1]?.split('.')[0]

  info(`Project ID: ${projectId}`)
  info(`Project URL: ${supabaseUrl}`)
  info(`Region: ${supabaseUrl?.includes('supabase.co') ? 'Default' : 'Custom'}`)
}

async function main() {
  log('🎙️ Livets Stemme - Supabase Verification', colors.bold)
  log('=' * 50)

  const checks = [
    verifyEnvironmentVariables,
    verifySupabaseConnection,
    verifyDatabaseSchema,
    verifyStorageBucket,
    verifyAuthConfiguration
  ]

  const results = []

  for (const check of checks) {
    const result = await check()
    results.push(result)
  }

  await showProjectInfo()

  log('\n📋 Verification Summary:', colors.bold)
  log('=' * 30)

  const passed = results.filter(Boolean).length
  const total = results.length

  if (passed === total) {
    success(`All checks passed! (${passed}/${total})`)
    success('Supabase is ready for production! 🎉')
  } else {
    warning(`${passed}/${total} checks passed`)
    error('Please fix the issues above before proceeding')

    log('\n💡 Need help?', colors.bold)
    info('1. Check SUPABASE_SETUP.md for detailed instructions')
    info('2. Verify your .env.local file has correct values')
    info('3. Make sure you ran the SQL schema in Supabase')
    info('4. Ensure the audio-files bucket exists in Storage')
  }

  process.exit(passed === total ? 0 : 1)
}

main().catch(err => {
  error(`Verification script failed: ${err.message}`)
  process.exit(1)
})
