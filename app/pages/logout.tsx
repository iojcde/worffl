import { BlitzPage, useMutation } from 'blitz'
import Layout from 'app/core/layouts/Layout'

import logOut from 'app/auth/mutations/logout'
const LogoutPage: BlitzPage = () => {
  const [logOutMutation] = useMutation(logOut)
  return (
    <div className="text-center ">
      <span className="font-bold text-4xl">Log Out</span>
      <p className="text-3xl pt-3">Are you sure?</p>
      <div className="flex gap-2 pt-4 max-w-xl mx-auto">
        <button className="mx-auto " onClick={logOutMutation}>
          Nope, I made an oopsie
        </button>
        <button className="mx-auto error">Yes, I am absoulutly sure</button>
      </div>
    </div>
  )
}
LogoutPage.authenticate = { redirectTo: '/login' }
LogoutPage.getLayout = (page) => <Layout title={'Logout'}>{page}</Layout>
export default LogoutPage
