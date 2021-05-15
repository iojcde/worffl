import { useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { AutoComplete, Text, Card, Row, Select } from "@geist-ui/react"
import GitImportCard from "app/projects/components/GitImportCard"

const NewProjectPage: BlitzPage = () => {
  const [createProjectMutation] = useMutation(createProject)
  const gitHandler = () => {}

  return (
    <>
      <Text h2 className="text-4xl">
        Create New Project
      </Text>
      <Row style={{ flexWrap: "wrap" }} justify="space-around">
        <GitImportCard handler={gitHandler} />
      </Row>
    </>
  )
}

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create New Project"}>{page}</Layout>

export default NewProjectPage
