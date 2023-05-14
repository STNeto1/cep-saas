import { SSTConfig } from 'sst'
import { API } from './stacks/Api'
import { Database } from './stacks/Database'
import { Secret } from './stacks/Secret'

export default {
  config(_input) {
    return {
      name: 'cep-saas',
      region: 'sa-east-1'
    }
  },
  stacks(app) {
    app.stack(Secret).stack(Database).stack(API)
  }
} satisfies SSTConfig
