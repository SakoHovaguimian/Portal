import { strings } from '@/content/strings'
import { NextRequest } from 'next/server'
import { container } from '@/container'

interface RouteContext {
  params: Promise<{
    path: string[]
  }>
}

async function handleRequest(request: NextRequest, context: RouteContext): Promise<Response> {

  if (!isTrustedMutation(request)) {

    return Response.json(
      { statusCode: 403, name: strings.metadata.apiBackendPathRoute.forbidden, message: strings.metadata.apiBackendPathRoute.untrustedOrigin },
      { status: 403 },
    )

  }

  const session = await container.sessionService.getValidSession()

  if (!session) {

    return Response.json(
      { statusCode: 401, name: strings.metadata.apiBackendPathRoute.unauthorized, message: strings.metadata.apiBackendPathRoute.sessionExpired },
      { status: 401 },
    )

  }

  const { path } = await context.params
  const safePath = path.map((segment) => encodeURIComponent(segment)).join('/')
  const upstreamPath = `/api/${safePath}${request.nextUrl.search}`

  return container.apiClient.proxy(request, upstreamPath, session.id_token)

}

function isTrustedMutation(request: NextRequest): boolean {

  if (request.method === 'GET' || request.method === 'HEAD') {
    return true
  }

  const origin = request.headers.get('origin')

  if (!origin) {
    return true
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')
  const forwardedProtocol = request.headers.get('x-forwarded-proto')
  const protocol = forwardedProtocol || request.nextUrl.protocol.replace(':', '')

  return origin === `${protocol}://${host}`

}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
