import { Event } from '@cep-saas/core/event'
import { SQSEvent } from 'aws-lambda'
import { z } from 'zod'

const successSchema = z.object({
  type: z.literal('success'),
  body: z.object({
    cep: z.string().length(8),
    userID: z.string(),
    timestamp: z.coerce.date()
  })
})

const failureSchema = z.object({
  type: z.literal('failure'),
  body: z.object({
    reason: z.string(),
    timestamp: z.coerce.date()
  })
})

const eventSchema = z.union([successSchema, failureSchema])

export const handler = (event: SQSEvent) => {
  event.Records.forEach(async (record) => {
    const parsed = JSON.parse(record.body)
    const result = eventSchema.safeParse(parsed)

    if (!result.success) {
      console.error(result.error)
      return
    }

    const { type, body } = result.data
    if (type === 'success') {
      await Event.createSuccessEvent(body.userID, body.cep)
      await Event.incrementAggregate(body.userID, body.timestamp)
    }

    if (type === 'failure') {
      await Event.createFailureEvent(body.reason)
      // TODO: increment failure aggregate?
    }
  })

  return {}
}
