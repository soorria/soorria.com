import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'

export const GET = (req: NextRequest) => {
  return NextResponse.redirect(new URL('/authentic-artistique-endevours', req.nextUrl))
}
