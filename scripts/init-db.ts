#!/usr/bin/env node

import { initializeDatabase } from '../lib/db/setup'

console.log('Initializing AI Safety Journey database...')

const forceReset = process.argv.includes('--force')

if (forceReset) {
  console.log('Force reset enabled - will delete existing database')
}

try {
  initializeDatabase(forceReset)
  console.log('✅ Database initialized successfully!')
} catch (error) {
  console.error('❌ Error initializing database:', error)
  process.exit(1)
}