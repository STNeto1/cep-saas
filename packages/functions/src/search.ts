import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { Cep } from '@cep-saas/core/cep'
import { User } from '@cep-saas/core/user'

import { Unauthorized } from 'src/generic_responses'
import { ApiHandler } from 'sst/node/api'
import { Queue } from 'sst/node/queue'
import { z } from 'zod'

const sqs = new SQSClient({})

const paramSchema = z.object({
  cep: z.string().length(8)
})

const sendFailureEvent = async (reason: string) => {
  const command = new SendMessageCommand({
    QueueUrl: Queue.queue.queueUrl,
    MessageBody: JSON.stringify({
      type: 'failure',
      body: {
        reason,
        timestamp: new Date()
      }
    })
  })

  await sqs.send(command)
}

const sendSuccessEvent = async (cep: string, userID: string) => {
  const command = new SendMessageCommand({
    QueueUrl: Queue.queue.queueUrl,
    MessageBody: JSON.stringify({
      type: 'success',
      body: {
        cep,
        userID,
        timestamp: new Date()
      }
    })
  })

  await sqs.send(command)
}

export const handler = ApiHandler(async (evt) => {
  const token = evt.headers['x-api-key']
  if (!token) {
    await sendFailureEvent('Missing API Key')
    return Unauthorized
  }

  // Validate before querying the authorization?
  const result = paramSchema.safeParse(evt.pathParameters)
  if (!result.success) {
    await sendFailureEvent('Invalid CEP')
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
    await sendFailureEvent('Invalid API Key')
    return Unauthorized
  }

  await sendSuccessEvent(result.data.cep, user.userID)
  return {
    statusCode: 200,
    body: JSON.stringify(dynamoData)
  }
})
