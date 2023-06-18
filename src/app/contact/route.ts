import { NextRequest, NextResponse } from 'next/server'

export const GET = (req: NextRequest) => {
  return NextResponse.redirect(new URL('/?ref=/contact#contact', req.url))
}
