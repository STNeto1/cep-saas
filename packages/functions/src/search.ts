import { Cep } from '@cep-saas/core/cep'
import { ApiHandler } from 'sst/node/api'
import { z } from 'zod'

const paramSchema = z.object({
  cep: z.string().length(8)
})

export const handler = ApiHandler(async (evt) => {
  const result = paramSchema.safeParse(evt.pathParameters)
  if (!result.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid CEP'
      })
    }
  }

  const dynamoData = await Cep.fromPostalCode(result.data.cep)

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoData)
  }
})
