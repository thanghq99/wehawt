import { readFileSync } from 'fs'
import { join } from 'path'
import { query, transaction } from './db'

// Migration tracking table
const MIGRATIONS_TABLE = 'schema_migrations'

// Initialize migrations table
async function initMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

// Get list of executed migrations
async function getExecutedMigrations(): Promise<string[]> {
  try {
    const result = await query(`SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY id`)
    return result.rows.map(row => row.filename)
  } catch (error) {
    console.error('Error getting executed migrations:', error)
    return []
  }
}

// Mark migration as executed
async function markMigrationExecuted(filename: string) {
  await query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [filename])
}

// Run a single migration
async function runMigration(filename: string) {
  const migrationPath = join(process.cwd(), 'src/lib/migrations', filename)
  
  try {
    const sql = readFileSync(migrationPath, 'utf8')
    
    await transaction(async (client) => {
      await client.query(sql)
      await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [filename])
    })
    
    console.log(`✅ Migration ${filename} executed successfully`)
  } catch (error) {
    console.error(`❌ Migration ${filename} failed:`, error)
    throw error
  }
}

// Run all pending migrations
export async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...')
    
    // Initialize migrations table
    await initMigrationsTable()
    
    // Get list of migration files
    const migrationFiles = [
      '001_initial_schema.sql',
      '002_indexes.sql'
    ]
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations()
    
    // Run pending migrations
    for (const filename of migrationFiles) {
      if (!executedMigrations.includes(filename)) {
        console.log(`🔄 Running migration: ${filename}`)
        await runMigration(filename)
      } else {
        console.log(`⏭️  Migration ${filename} already executed`)
      }
    }
    
    console.log('✅ All migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Reset database (for development only)
export async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot reset database in production')
  }
  
  console.log('🔄 Resetting database...')
  
  await transaction(async (client) => {
    // Drop all tables
    await client.query(`
      DROP TABLE IF EXISTS 
        analytics,
        media,
        content,
        orders,
        products,
        pages,
        user_sessions,
        organization_members,
        organizations,
        users,
        ${MIGRATIONS_TABLE}
      CASCADE
    `)
  })
  
  console.log('✅ Database reset completed')
}
