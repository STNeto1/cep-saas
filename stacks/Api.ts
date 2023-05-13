import { StackContext, Api, use } from "sst/constructs";
import { Database } from "./Database";

export function API({ stack }: StackContext) {
  const db = use(Database);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [db]
      }
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler"
    }
  });

  stack.addOutputs({
    ApiEndpoint: api.url
  });
}
