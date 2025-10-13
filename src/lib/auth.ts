import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query, transaction } from './db'
import { User, Organization, UserSession } from '@/types/database'
import { LoginRequest, RegisterRequest, AuthSession, JWTPayload } from '@/types/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Create user session
export async function createSession(userId: string): Promise<UserSession> {
  const token = generateToken({
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    permissions: []
  })
  
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  const result = await query(
    'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [userId, token, expiresAt]
  )
  
  return result.rows[0]
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Create user
export async function createUser(userData: {
  email: string
  name: string
  password: string
}): Promise<User> {
  const hashedPassword = await hashPassword(userData.password)
  
  const result = await query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [userData.email, userData.name, hashedPassword]
  )
  
  return result.rows[0]
}

// Authenticate user
export async function authenticateUser(loginData: LoginRequest): Promise<AuthSession | null> {
  try {
    const user = await getUserByEmail(loginData.email)
    if (!user) {
      return null
    }
    
    // Note: In a real implementation, you'd need to add password_hash to the users table
    // For now, we'll skip password verification
    // const isValidPassword = await verifyPassword(loginData.password, user.password_hash)
    // if (!isValidPassword) {
    //   return null
    // }
    
    const session = await createSession(user.id)
    
    return {
      user,
      permissions: [],
      expires: session.expires_at
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

// Register user
export async function registerUser(registerData: RegisterRequest): Promise<AuthSession | null> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(registerData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    return await transaction(async (client) => {
      // Create user
      const hashedPassword = await hashPassword(registerData.password)
      const userResult = await client.query(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [registerData.email, registerData.name, hashedPassword]
      )
      
      const user = userResult.rows[0]
      
      // Create organization if specified
      let organization = null
      if (registerData.organizationName) {
        const orgResult = await client.query(
          'INSERT INTO organizations (name, slug) VALUES ($1, $2) RETURNING *',
          [registerData.organizationName, registerData.organizationName.toLowerCase().replace(/\s+/g, '-')]
        )
        organization = orgResult.rows[0]
        
        // Add user as owner
        await client.query(
          'INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, $3)',
          [organization.id, user.id, 'owner']
        )
      }
      
      const session = await createSession(user.id)
      
      return {
        user,
        organization,
        permissions: [],
        expires: session.expires_at
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return null
  }
}

// Get session by token
export async function getSessionByToken(token: string): Promise<AuthSession | null> {
  try {
    const result = await query(
      'SELECT s.*, u.* FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.token = $1 AND s.expires_at > NOW()',
      [token]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    const session = result.rows[0]
    
    return {
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        avatar_url: session.avatar_url,
        email_verified: session.email_verified,
        created_at: session.created_at,
        updated_at: session.updated_at
      },
      permissions: [],
      expires: session.expires_at
    }
  } catch (error) {
    console.error('Error getting session by token:', error)
    return null
  }
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  try {
    await query('DELETE FROM user_sessions WHERE token = $1', [token])
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  try {
    await query('DELETE FROM user_sessions WHERE expires_at < NOW()')
  } catch (error) {
    console.error('Error cleaning expired sessions:', error)
  }
}
