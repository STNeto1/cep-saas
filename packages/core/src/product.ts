import { Entity, EntityItem } from 'electrodb'
import { Config } from 'sst/node/config'
import Stripe from 'stripe'
import { ulid } from 'ulid'
import { Dynamo } from './dynamo'
export * as Product from './product'

export const ProductEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'Product',
      service: 'stripe'
    },
    attributes: {
      productID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      stripeProductID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      stripePriceID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      name: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: false
      },
      price: {
        type: 'number',
        required: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['productID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byStripeProductID: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['stripeProductID']
        },
        sk: {
          field: 'gsi1sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type Info = EntityItem<typeof ProductEntity>

export const fromStripeProductID = async (stripeProductID: string) => {
  const result = await ProductEntity.query
    .byStripeProductID({
      stripeProductID
    })
    .go()

  if (!result.data) {
    return undefined
  }

  return result.data.at(0)
}

export const fromProductID = async (productID: string) => {
  const result = await ProductEntity.get({ productID }).go()

  if (!result.data) {
    return undefined
  }

  return result.data
}

export const all = async () => {
  const result = await ProductEntity.scan.go()

  if (!result.data) {
    return []
  }

  return result.data
}

export const create = async (data: {
  name: string
  description?: string
  price: number
}) => {
  const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
  })

  const product = await stripe.products.create({
    name: data.name,
    description: data.description
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: data.price * 100,
    currency: 'brl',
    recurring: {
      interval: 'month'
    }
  })

  const result = await ProductEntity.create({
    stripeProductID: product.id,
    stripePriceID: price.id,
    productID: ulid(),
    description: data.description,
    name: data.name,
    price: data.price
  }).go()

  return result.data
}
