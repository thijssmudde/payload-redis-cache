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
    redisIndexesName: indexesName = 'payload-cache-index',
    socketOptions
  } = params
  initRedisContext({ url, namespace, indexesName, socketOptions })
}

export const cachePlugin =
  (pluginOptions: PluginOptions): Plugin =>
    (config: Config): Config | Promise<Config> => {
      // Merge incoming plugin options with the default ones
      const { includedCollections = [], includedGlobals = [], includedPaths = [] } = pluginOptions

      const collections = config?.collections
        ? config.collections?.map((collection): CollectionConfig => {
          const { hooks } = collection

          if (includedCollections.includes(collection.slug)) {
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

          if (includedGlobals.includes(global.slug)) {
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
