const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection for migrations
const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Migration tracking table
const MIGRATIONS_TABLE = 'external_api_migrations';

// Initialize migrations table
async function initMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// Get list of executed migrations
async function getExecutedMigrations() {
  try {
    const result = await pool.query(`SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY id`);
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('Error getting executed migrations:', error);
    return [];
  }
}

// Mark migration as executed
async function markMigrationExecuted(filename) {
  await pool.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [filename]);
}

// Run a single migration
async function runMigration(filename) {
  const migrationPath = path.join(__dirname, 'migrations', filename);
  
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query('BEGIN');
    await pool.query(sql);
    await pool.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [filename]);
    await pool.query('COMMIT');
    
    console.log(`✅ Migration ${filename} executed successfully`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`❌ Migration ${filename} failed:`, error);
    throw error;
  }
}

// Run all pending migrations
async function runMigrations() {
  try {
    console.log('🔄 Starting external API database migrations...');
    
    // Initialize migrations table
    await initMigrationsTable();
    
    // Get list of migration files
    const migrationFiles = [
      '001_external_api_schema.sql',
      '002_external_api_indexes.sql',
      '003_external_api_data.sql'
    ];
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    
    // Run pending migrations
    for (const filename of migrationFiles) {
      if (!executedMigrations.includes(filename)) {
        console.log(`🔄 Running migration: ${filename}`);
        await runMigration(filename);
      } else {
        console.log(`⏭️  Migration ${filename} already executed`);
      }
    }
    
    console.log('✅ All external API migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Reset database (for development only)
async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot reset database in production');
  }
  
  console.log('🔄 Resetting external API database...');
  
  await pool.query('BEGIN');
  await pool.query(`
    DROP TABLE IF EXISTS 
      external_api_analytics,
      external_api_webhooks,
      external_api_events,
      external_api_sessions,
      external_api_users,
      external_api_organizations,
      ${MIGRATIONS_TABLE}
    CASCADE
  `);
  await pool.query('COMMIT');
  
  console.log('✅ External API database reset completed');
  await pool.end();
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'reset') {
    resetDatabase().catch(console.error);
  } else {
    runMigrations().catch(console.error);
  }
}

module.exports = {
  runMigrations,
  resetDatabase
};
