import { BlitzPage, dynamic } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import { Suspense } from 'react'
const GitImportCard = dynamic(import('app/projects/components/GitImportCard'))

const NewProjectPage: BlitzPage = () => {
  return (
    <div
      className="rounded-md md:border  md:p-8 filter md:drop-shadow-xl bg-white"
      style={{ height: 600 }}
    >
      <h2 className="text-4xl font-semibold ">Create New Project</h2>

      <p className="text-2xl pt-2">Import Git repository</p>
      <Suspense fallback={'hi'}>
        <GitImportCard />
      </Suspense>
    </div>
  )
}

NewProjectPage.authenticate = { redirectTo: '/' }
NewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>

export default NewProjectPage
