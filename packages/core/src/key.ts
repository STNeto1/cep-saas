import { Entity, EntityItem } from 'electrodb'
import { ulid } from 'ulid'
import { Dynamo } from './dynamo'

export * as Key from './key'

export const KeyEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'Key',
      service: 'keys'
    },
    attributes: {
      keyID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      userID: {
        type: 'string',
        required: true,
        readonly: true
      },
      value: {
        type: 'string',
        required: true,
        readonly: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['keyID', 'userID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byValue: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['value']
        },
        sk: {
          field: 'gsi1sk',
          composite: []
        }
      },
      byUser: {
        index: 'gsi2',
        pk: {
          field: 'gsi2pk',
          composite: ['userID']
        },
        sk: {
          field: 'gsi2sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type Info = EntityItem<typeof KeyEntity>

export const create = async (userID: string) => {
  const result = await KeyEntity.create({
    userID,
    keyID: ulid(),
    value: `sk_live_${ulid()}`
  }).go()

  return result.data
}

export const fromIDWithUser = async (id: string, userID: string) => {
  return await KeyEntity.get({
    keyID: id,
    userID
  }).go()
}

export const list = async (userID: string) => {
  const result = await KeyEntity.query.byUser({ userID }).go()

  return result.data
}

export const deleteFromId = async (id: string, userID: string) => {
  const result = await KeyEntity.delete({
    keyID: id,
    userID
  }).go()

  return Boolean(result.data)
}

export const fromValue = async (value: string) => {
  const result = await KeyEntity.query.byValue({ value }).go()

  if (result.data.length === 0) {
    return null
  }

  return result.data.at(0)
}
