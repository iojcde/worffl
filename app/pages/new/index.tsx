import { BlitzPage, dynamic } from 'blitz'
import { Card } from '@geist-ui/react'

import Layout from 'app/core/layouts/Layout'
import { Text, Loading } from '@geist-ui/react'
import { Suspense } from 'react'
const GitImportCard = dynamic(import('app/projects/components/GitImportCard'))

const NewProjectPage: BlitzPage = () => {
  return (
    <>
      <Text h2 className="text-4xl ">
        Create New Project
      </Text>
      <div className=" shadow-xl mb-20 transition ">
        <Card style={{ height: '530px' }}>
          <h4>Import Git repository</h4>
          <Suspense fallback={<Loading />}>
            <GitImportCard />
          </Suspense>
        </Card>
      </div>
    </>
  )
}

NewProjectPage.authenticate = { redirectTo: '/' }
NewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>

export default NewProjectPage
