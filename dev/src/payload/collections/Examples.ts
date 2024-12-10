import { AccessResult } from 'payload/config'
import type { CollectionConfig } from 'payload'

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
export const Examples: CollectionConfig = {
  slug: 'examples',
  admin: {
    useAsTitle: 'someField'
  },
  access: {
    read: ({ req }): AccessResult => {
      const { user } = req
      return !!user
    }
  },
  // access: {
  //   read: () => true
  // },
  hooks: {
    afterRead: [
      () => {
        console.log('>> Reading from DB')
      }
    ]
  },
  fields: [
    {
      name: 'someField',
      type: 'text'
    }
  ]
}
