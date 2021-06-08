/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Layout from 'app/core/layouts/Layout'
import getProject from 'app/projects/queries/getProject'
import { BlitzPage, useParams, useQuery } from 'blitz'
import { Suspense } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
const ProjectPage: BlitzPage = () => {
  const params = useParams('string')
  return (
    <Layout title={`${params.namespace}/${params.project}`}>
      <Suspense fallback={AiOutlineLoading}>
        <Data nmsp={params.namespace!} prj={params.project!} />
      </Suspense>
    </Layout>
  )
}
const Data: React.FC<{ nmsp: string; prj: string }> = ({ nmsp, prj }) => {
  const [projectData] = useQuery(getProject, {
    name: prj,
    id: 1,
  })
  return (
    <>
      <div>
        <div className="flex flex-wrap gap-8 md:justify-between">
          <span
            style={{ maxWidth: '90%' }}
            className=" md:text-4xl text-3xl inline-block overflow-hidden overflow-ellipsis min-w-0 whitespace-nowrap break-normal"
          >
            {prj}
          </span>
          <button className="button wide text-sm">Visit</button>
        </div>

        <div className="">
          <span className="uppercase text-xs"> GIT</span>
          <p className="text-sm font-medium">{projectData.GhRepo?.name}</p>
        </div>
      </div>
      <p> Project Info:</p>
      <p>created at: {projectData.createdAt.toUTCString()}</p>
      <p>updated at: {projectData.updatedAt.toUTCString()}</p>
    </>
  )
}

export default ProjectPage
