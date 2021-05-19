import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import React, { Suspense } from 'react'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */
const UserSection: React.FC = () => {
  const user = useCurrentUser()

  return (
    <>
      <button
        onClick={() =>
          window.open(
            '/api/auth/github',
            'Sign up with GitHub',
            'toolbar=no,location=no,menubar=no',
          )
        }
      >
        Login with GitHub
      </button>
      id: {user?.id}
      {user?.name}
    </>
  )
}
const Home: BlitzPage = () => {
  return (
    <Suspense fallback={<p>loading..</p>}>
      <UserSection />{' '}
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
