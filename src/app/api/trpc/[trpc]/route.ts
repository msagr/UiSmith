// import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '@/trpc/routers/_app';
import { createContext } from '@/app/server/context';
// export API handler
// @link https://trpc.io/docs/v11/server/adapters
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  });
}

export async function POST(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  });
}
