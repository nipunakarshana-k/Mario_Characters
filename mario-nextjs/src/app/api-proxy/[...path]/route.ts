import { NextRequest, NextResponse } from 'next/server'
import http from 'http'
import https from 'https'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

async function proxy(req: NextRequest, pathParts: string[]): Promise<NextResponse> {
  const path = pathParts.join('/')
  const search = req.nextUrl.search
  const target = new URL(`${API_BASE}/${path}${search}`)

  let body: Buffer | undefined
  if (!['GET', 'HEAD', 'DELETE'].includes(req.method)) {
    const buf = await req.arrayBuffer()
    body = Buffer.from(buf)
  }

  return new Promise((resolve) => {
    const isHttps = target.protocol === 'https:'
    const requester = isHttps ? https : http

    const options: http.RequestOptions = {
      hostname: target.hostname,
      port: Number(target.port) || (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      ...(isHttps ? { rejectUnauthorized: false } : {}), // bypass self-signed cert for local HTTPS
      headers: {
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': body.length } : {}),
      },
    }

    const proxyReq = requester.request(options, (proxyRes) => {
      const chunks: Buffer[] = []
      proxyRes.on('data', (c) => chunks.push(c))
      proxyRes.on('end', () => {
        const status = proxyRes.statusCode ?? 500
        const responseBody = status === 204 ? null : Buffer.concat(chunks)
        resolve(
          new NextResponse(responseBody, {
            status,
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
    })

    proxyReq.on('error', (err) => {
      resolve(NextResponse.json({ error: err.message }, { status: 502 }))
    })

    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path)
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path)
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path)
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path)
}
