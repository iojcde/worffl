import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import { Button } from '@geist-ui/react'
const LogoutPage: BlitzPage = () => {
  return (
    <div className="">
      <h1>Log out</h1>
      <h3>Are you sure?</h3>
      <div className="flex gap-2">
        <Button auto>Nope, I made an oopsie</Button>
        <Button auto type="error">
          Yes, I am absoulutly sure
        </Button>
      </div>
    </div>
  )
}
LogoutPage.authenticate = { redirectTo: '/login' }
LogoutPage.getLayout = (page) => <Layout title={'Logout'}>{page}</Layout>
export default LogoutPage
