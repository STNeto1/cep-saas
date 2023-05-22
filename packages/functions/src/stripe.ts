import { ApiHandler } from 'sst/node/api'
import { z } from 'zod'
import { Product } from '@cep-saas/core/product'

import { useStaffId } from './hooks'
import { SchemaError, Unauthorized } from './generic_responses'

const paramSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.optional(z.string().min(3).max(50)),
  price: z.number().min(0.01).max(999999.99)
})

export const createHandler = ApiHandler(async (evt) => {
  const staffUsr = useStaffId()
  if (!staffUsr) {
    return Unauthorized
  }

  if (!evt.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid request'
      })
    }
  }

  const result = paramSchema.safeParse(JSON.parse(evt.body))
  if (!result.success) {
    return SchemaError(result.error)
  }

  const product = await Product.create({
    name: result.data.name,
    description: result.data.description,
    price: result.data.price
  })

  return {
    statusCode: 201,
    body: JSON.stringify(product)
  }
})

export const listHandler = ApiHandler(async () => {
  const staffUsr = useStaffId()
  if (!staffUsr) {
    return Unauthorized
  }

  const products = await Product.all()

  return {
    statusCode: 200,
    body: JSON.stringify(products)
  }
})
