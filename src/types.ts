import { RedisClientOptions } from 'redis'

export interface RedisInitOptions {
  redisUrl: string
  redisNamespace?: string
  redisIndexesName?: string
  socketOptions?: RedisClientOptions['socket']
}

export interface PluginOptions {
  includedCollections?: string[]
  includedGlobals?: string[]
  includedPaths?: string[]
}

export interface JwtToken {
  id: string
  collection: string
  email: string
}

export const DEFAULT_USER_COLLECTION = 'loggedout'

export interface cacheMiddlewareArgs {
  includedCollections: string[]
  includedGlobals: string[]
  includedPaths: string[]
  apiBaseUrl: string
}
