import { Entity, EntityItem } from 'electrodb'
import { Dynamo } from './dynamo'
export * as Cep from './cep'

export const CepEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'CEP',
      service: 'cep'
    },
    attributes: {
      postalCode: {
        type: 'string',
        required: true,
        readOnly: true
      },
      street: {
        type: 'string',
        required: true
      },
      neighborhood: {
        type: 'string',
        required: true
      },
      city: {
        type: 'string',
        required: true
      },
      state: {
        type: 'string',
        required: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['postalCode']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type Info = EntityItem<typeof CepEntity>

export const fromPostalCode = async (postalCode: string): Promise<Info> => {
  const result = await CepEntity.get({
    postalCode
  }).go()

  if (!result.data) {
    const newEntry = await fetchUnknownPostalCode(postalCode)
    await CepEntity.create(newEntry).go()
    return newEntry
  }

  return result.data
}

export const fetchUnknownPostalCode = async (
  postalCode: string
): Promise<Info> => {
  // sleep 500ms
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    postalCode,
    street: 'Rua Juscelino Kubitschek',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
  }
}
