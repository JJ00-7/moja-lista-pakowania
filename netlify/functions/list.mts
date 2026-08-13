import type { Context, Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (req: Request, context: Context) => {
  const { code } = context.params
  const store = getStore('packing-lists')

  if (req.method === 'GET') {
    const list = await store.get(code, { type: 'json' })
    return Response.json(list ?? { items: [] })
  }

  if (req.method === 'PUT') {
    const body = await req.json()
    await store.setJSON(code, body)
    return new Response(null, { status: 204 })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = {
  path: '/api/lists/:code',
  method: ['GET', 'PUT'],
}