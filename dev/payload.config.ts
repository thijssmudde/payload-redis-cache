import { buildConfig } from 'payload'

// import { cachePlugin, initRedis } from '@aengz/payload-redis-cache'
import { cachePlugin } from '@aengz/payload-redis-cache'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections
import { Examples } from './src/payload/collections/Examples'
import { Users } from './src/payload/collections/Users'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_URL,
  onInit: () => {
    // initRedis({
    //   redisUrl: process.env.REDIS_URI!
    // })
  },
  admin: {
    user: Users.slug
  },
  collections: [Users, Examples],

  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || ''
  }),
  plugins: [
    cachePlugin({ excludedCollections: ['users'] }) // ADD HERE
  ],
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || ''
})
