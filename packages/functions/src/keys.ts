import { Key } from '@cep-saas/core/key'
import { SchemaError, Unauthorized } from 'src/generic_responses'
import { useUserId } from 'src/hooks'
import { ApiHandler } from 'sst/node/api'
import { z } from 'zod'

export const createHandler = ApiHandler(async (evt) => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  await Key.create(userId)

  return {
    statusCode: 201
  }
})

export const listHandler = ApiHandler(async (evt) => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  const keys = await Key.list(userId)

  return {
    statusCode: 200,
    body: JSON.stringify(
      keys.map((elem) => ({
        id: elem.keyID,
        value: elem.value
      }))
    )
  }
})

const deleteSchema = z.object({
  id: z.string().ulid()
})

export const deleteHandler = ApiHandler(async (evt) => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  const schemaResult = deleteSchema.safeParse(evt.pathParameters)
  if (!schemaResult.success) {
    return SchemaError(schemaResult.error)
  }

  const { id } = schemaResult.data
  const deletedWithSuccess = Key.deleteFromId(id, userId)

  if (!deletedWithSuccess) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid request'
      })
    }
  }

  return {
    statusCode: 204
  }
})
