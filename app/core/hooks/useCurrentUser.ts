import { useQuery } from "blitz"
import getCurrentUser, { getCurrentUserResult } from "app/users/queries/getCurrentUser"

const useCurrentUser = (): getCurrentUserResult | null => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
export { useCurrentUser }
