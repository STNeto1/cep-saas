import { Cep } from '@cep-saas/core/cep'
import { User } from '@cep-saas/core/user'
import { Unauthorized } from 'src/generic_responses'
import { ApiHandler } from 'sst/node/api'
import { z } from 'zod'

const paramSchema = z.object({
  cep: z.string().length(8)
})

export const handler = ApiHandler(async (evt) => {
  const token = evt.headers['x-api-key']
  if (!token) {
    return Unauthorized
  }

  // Validate before querying the authorization?
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

  const user = await User.fromApiKey(token)
  if (!user) {
    return Unauthorized
  }

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoData)
  }
})
