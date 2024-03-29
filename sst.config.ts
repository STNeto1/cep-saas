import { SSTConfig } from 'sst'
import { API } from './stacks/Api'
import { Database } from './stacks/Database'
import { QueueStack } from './stacks/Queue'
import { Secret } from './stacks/Secret'
import { Web } from './stacks/Web'

export default {
  config(_input) {
    return {
      name: 'cep-saas',
      region: 'sa-east-1'
    }
  },
  stacks(app) {
    app.stack(Secret).stack(Database).stack(QueueStack).stack(API).stack(Web)
  }
} satisfies SSTConfig
