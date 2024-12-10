import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function middleware(request: NextRequest) {
  // eslint-disable-next-line no-console
  console.log('middleware hit: ', request.url)
  return NextResponse.next()
}
