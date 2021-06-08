import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import { useEffect } from 'react'

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Done: BlitzPage = () => {
  useEffect(() => window.close())
  return <h2>Success! This window will close automatically...</h2>
}

Done.suppressFirstRenderFlicker = true
Done.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Done
