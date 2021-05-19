import { BlitzPage } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import { Card, Text } from '@geist-ui/react'

const EditNewProjectPage: BlitzPage = () => {
  return (
    <>
      <Text h2 className="text-4xl ">
        Edit details
        <Card></Card>
      </Text>
      <div className=" shadow-xl mb-20 transition "></div>
    </>
  )
}

EditNewProjectPage.authenticate = { redirectTo: '/login' }
EditNewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>

export default EditNewProjectPage
