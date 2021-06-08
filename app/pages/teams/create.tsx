import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'

const NewProjectPage: BlitzPage = () => {
  return (
    <>
      <h2 className="text-4xl font-semibold ">Create a Team</h2>
    </>
  )
}

NewProjectPage.authenticate = { redirectTo: '/' }
NewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>

export default NewProjectPage
