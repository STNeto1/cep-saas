import { Event } from '@cep-saas/core/event'
import { User } from '@cep-saas/core/user'
import { Unauthorized } from 'src/generic_responses'
import { useUserId } from 'src/hooks'
import { ApiHandler } from 'sst/node/api'

export const reportHandler = ApiHandler(async () => {
  const userId = useUserId()
  if (!userId) {
    return Unauthorized
  }

  const { data: user } = await User.fromID(userId)
  if (!user) {
    return Unauthorized
  }

  const data = await Event.aggregateFromUser(userId)

  const yearlyResult: Record<string, number> = {}
  data.forEach((item) => {
    const existingYear = yearlyResult[item.year]
    if (existingYear) {
      yearlyResult[item.year] = existingYear + item.count
      return
    }

    yearlyResult[item.year] = item.count
  })

  const monthlyResult: Record<string, number> = {}
  data.forEach((item) => {
    const key = `${item.year}-${item.month}`

    const existingValue = monthlyResult[key]
    if (existingValue) {
      monthlyResult[key] = existingValue + item.count
      return
    }

    monthlyResult[key] = item.count
  })

  const dailyResult: Record<string, number> = {}
  data.forEach((item) => {
    const key = `${item.year}-${item.month}-${item.day}`
    const existingValue = dailyResult[key]
    if (existingValue) {
      dailyResult[key] = existingValue + item.count
      return
    }

    dailyResult[key] = item.count
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      yearly: yearlyResult,
      monthly: monthlyResult,
      daily: dailyResult
    })
  }
})
