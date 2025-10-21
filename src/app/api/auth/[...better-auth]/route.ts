import { auth } from '@/lib/better-auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return auth.handler(request)
}

export async function POST(request: NextRequest) {
  return auth.handler(request)
}
