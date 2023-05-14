import { User } from '@cep-saas/core/user'
import { Unauthorized } from 'src/generic_responses'
import { useUserId } from 'src/hooks'
import { ApiHandler } from 'sst/node/api'

export const profileHandler = ApiHandler(async () => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  const { data: user } = await User.fromID(userId)
  if (!user) {
    return Unauthorized
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: user.userID,
      email: user.email,
      apiKey: user.apiKey
    })
  }
})

export const refreshHandler = ApiHandler(async () => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  await User.refreshApiKey(userId)

  return {
    statusCode: 204
  }
})
