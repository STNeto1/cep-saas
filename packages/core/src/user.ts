import { Entity, EntityItem } from 'electrodb'
import { Dynamo } from './dynamo'
import { ulid } from 'ulid'

export * as User from './user'

export const UserEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'User',
      service: 'auth'
    },
    attributes: {
      userID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      name: {
        type: 'string',
        required: false,
        readOnly: false
      },
      profilePicture: {
        type: 'string',
        required: false,
        readOnly: false
      },
      email: {
        type: 'string',
        required: true
      },
      apiKey: {
        type: 'string',
        required: true
      },
      role: {
        type: ['user', 'staff'] as const,
        required: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['userID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byEmail: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['email']
        },
        sk: {
          field: 'gsi1sk',
          composite: []
        }
      },
      byRole: {
        index: 'gsi2',
        pk: {
          field: 'gsi2pk',
          composite: ['role']
        },
        sk: {
          field: 'gsi2sk',
          composite: []
        }
      },
      byApiKey: {
        index: 'gsi3',
        pk: {
          field: 'gsi3pk',
          composite: ['apiKey']
        },
        sk: {
          field: 'gsi3sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type Info = EntityItem<typeof UserEntity>

export async function fromID(id: string) {
  return await UserEntity.get({
    userID: id
  }).go()
}

export async function fromEmail(email: string) {
  const result = await UserEntity.query
    .byEmail({
      email: email
    })
    .go()

  return result.data.at(0)
}

export async function fromApiKey(apiKey: string) {
  const result = await UserEntity.query
    .byApiKey({
      apiKey
    })
    .go()

  return result.data.at(0)
}

export async function create(data: {
  email: string
  name?: string
  profilePicture?: string
}) {
  const result = await UserEntity.create({
    email: data.email,
    name: data.name,
    profilePicture: data.profilePicture,
    userID: ulid(),
    apiKey: ulid(),
    role: 'user'
  }).go()

  return result.data
}

export async function refreshApiKey(userID: string) {
  const result = await UserEntity.update({
    userID
  })
    .set({ apiKey: ulid() })
    .where((attr, op) => op.eq(attr.userID, userID))
    .go()

  return result.data
}
