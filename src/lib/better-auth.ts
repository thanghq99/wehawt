import { betterAuth } from 'better-auth'
import { callAPI } from '@/services/api-client'

// Custom adapter to use external API
const externalAPIAdapter = {
  async createUser(userData: any) {
    const response = await callAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    return response.user
  },
  
  async getUserByEmail(email: string) {
    const response = await callAPI(`/users?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    })
    return response.user
  },
  
  async getUserById(id: string) {
    const response = await callAPI(`/users/${id}`, {
      method: 'GET'
    })
    return response.user
  },
  
  async createSession(sessionData: any) {
    const response = await callAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    })
    return response
  },
  
  async getSession(token: string) {
    const response = await callAPI('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
    return response
  },
  
  async deleteSession(token: string) {
    await callAPI('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
  }
}

const config = {
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    } : undefined,
    github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    } : undefined
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  // Use external API adapter
  adapter: externalAPIAdapter
}

export const auth = betterAuth(config)

export default auth
