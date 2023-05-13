import { useSession } from 'sst/node/auth'

export const useUserId = () => {
  const data = useSession()

  if (data.type !== 'user') {
    return null
  }

  return data.properties.userID
}

export const useStaffId = () => {
  const data = useSession()

  if (data.type !== 'user') {
    return null
  }

  if (data.properties.role !== 'staff') {
    return null
  }

  return data.properties.userID
}
