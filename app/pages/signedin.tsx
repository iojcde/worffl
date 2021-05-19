import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import React, { Suspense } from 'react'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'
import { Loading } from '@geist-ui/react'

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Done: BlitzPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Section />
    </Suspense>
  )
}
const Section: React.FC = () => {
  const user = useCurrentUser()
  if (user !== null) {
    return <h2> Success! This window will close automatically...{window.close()}</h2>
  } else return <h2>Something went wrong... Close this window and try again, please.</h2>
}
Done.suppressFirstRenderFlicker = true
Done.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Done
