import { BlitzPage } from 'blitz'
import { Card, Row, Button } from '@geist-ui/react'
import { GitHub } from 'react-feather'
import Layout from 'app/core/layouts/Layout'
import { Text, Loading } from '@geist-ui/react'
import GitImportCard from 'app/projects/components/GitImportCard'
import { Suspense } from 'react'

const NewProjectPage: BlitzPage = () => {
  return (
    <>
      <Text h2 className="text-4xl ">
        Create New Project
      </Text>
      <div className=" shadow-xl mb-20 transition ">
        <Card style={{ height: '445px' }}>
          <h4>Import Git repository</h4>
          <Suspense
            fallback={
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            }
          >
            <GitImportCard />
          </Suspense>
        </Card>
      </div>
    </>
  )
}
const LoadingCard: React.FC = () => {
  return (
    <Card style={{ marginBottom: '3px' }}>
      <div className="flex items-center">
        <GitHub className="mr-3 md:w-5 md:h-5" />

        <span className="w-full">
          <Row style={{ width: '80px' }}>
            <Loading />
          </Row>
        </span>

        <Button disabled className="min-w-max px-3" size="small" type="success">
          Import
        </Button>
      </div>
    </Card>
  )
}

NewProjectPage.authenticate = { redirectTo: '/login' }
NewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>
export { LoadingCard }
export default NewProjectPage
