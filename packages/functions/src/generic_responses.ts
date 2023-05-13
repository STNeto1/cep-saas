import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { z } from 'zod'

export const Unauthorized: APIGatewayProxyStructuredResultV2 = {
  statusCode: 401,
  body: JSON.stringify({
    error: 'Unauthorized'
  })
}

export const SchemaError = (
  error: z.ZodError
): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 400,
  body: JSON.stringify({
    error: 'Invalid request',
    details: error.issues
  })
})
