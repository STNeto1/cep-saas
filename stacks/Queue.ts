import { Queue, StackContext, use } from 'sst/constructs'
import { Database } from './Database'

export function QueueStack({ stack }: StackContext) {
  const db = use(Database)

  const queue = new Queue(stack, 'queue', {
    consumer: 'packages/functions/src/consumer.handler'
  })

  queue.bind([db])

  stack.addOutputs({
    QueueURL: queue.queueUrl
  })

  return queue
}
