import type { Config, Plugin } from 'payload/config'
import { CollectionConfig, GlobalConfig } from 'payload/types'
import { initRedisContext } from './adapters/redis'
import { invalidateCacheAfterChangeHook, invalidateCacheAfterDeleteHook } from './hooks'
import { cacheMiddleware } from './middlewares'
import { PluginOptions, RedisInitOptions } from './types'
import { extendWebpackConfig } from './webpack'

export const initRedis = (params: RedisInitOptions) => {
  const {
    redisUrl: url,
    redisNamespace: namespace = 'payload',
    redisIndexesName: indexesName = 'payload-cache-index'
  } = params
  initRedisContext({ url, namespace, indexesName })
}

export const cachePlugin =
  (pluginOptions: PluginOptions): Plugin =>
    (config: Config): Config | Promise<Config> => {
      const includedCollections: string[] = []
      const includedGlobals: string[] = []

      // Merge incoming plugin options with the default ones
      const {
        includedCollections: userIncludedCollections = [],
        includedGlobals: userIncludedGlobals = [],
        includedPaths = []
      } = pluginOptions

      const collections = config?.collections
        ? config.collections?.map((collection): CollectionConfig => {
          const { hooks } = collection

          if (userIncludedCollections.includes(collection.slug)) {
            includedCollections.push(collection.slug)

            const afterChange = [...(hooks?.afterChange || []), invalidateCacheAfterChangeHook]
            const afterDelete = [...(hooks?.afterDelete || []), invalidateCacheAfterDeleteHook]

            return {
              ...collection,
              hooks: {
                ...hooks,
                afterChange,
                afterDelete
              }
            }
          }

          return collection
        })
        : []

      const globals = config?.globals
        ? config.globals?.map((global): GlobalConfig => {
          const { hooks } = global

          if (userIncludedGlobals.includes(global.slug)) {
            includedGlobals.push(global.slug)

            const afterChange = [...(hooks?.afterChange || []), invalidateCacheAfterChangeHook]

            return {
              ...global,
              hooks: {
                ...hooks,
                afterChange
              }
            }
          }

          return global
        })
        : []

      return {
        ...config,
        admin: {
          ...(config?.admin || {}),
          webpack: extendWebpackConfig({ config })
        },
        collections,
        globals,
        express: {
          preMiddleware: [
            ...(config?.express?.preMiddleware || []),
            cacheMiddleware({
              includedCollections,
              includedGlobals,
              includedPaths,
              apiBaseUrl: config?.routes?.api || '/api'
            })
          ]
        }
      }
    }
