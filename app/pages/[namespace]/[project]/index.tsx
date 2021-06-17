/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Layout from 'app/core/layouts/Layout'
import getProduction from 'app/projects/queries/getProduction'
import getProject from 'app/projects/queries/getProject'
import { BlitzPage, Link, Head, useParams, useQuery, useRouter } from 'blitz'
import { Suspense, useEffect } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
const ProjectPage: BlitzPage = () => {
  const params = useParams('string')
  return (
    <Suspense fallback={AiOutlineLoading}>
      <Data nmsp={params.namespace!} prj={params.project!} />
    </Suspense>
  )
}
const Data: React.FC<{ nmsp: string; prj: string }> = ({ nmsp, prj }) => {
  const router = useRouter()
  const [projectData] = useQuery(getProject, {
    name: prj,
  })
  useEffect(() => {
    if (projectData == null) router.push('/dashboard')
  })

  const [production] = useQuery(getProduction, { projectId: projectData!.id })

  return (
    <>
      <Head>
        <title>{prj}</title>
      </Head>
      <div className="">
        <div className="flex flex-wrap gap-8 md:justify-between">
          <span
            style={{ maxWidth: '90%' }}
            className=" md:text-4xl text-3xl inline-block font-medium overflow-hidden overflow-ellipsis min-w-0 whitespace-nowrap break-normal"
          >
            {prj}
          </span>
          {production && (
            <Link href={production.domain}>
              <a className="button wide text-sm">Visit</a>
            </Link>
          )}
        </div>

        <div className="">
          <span className="uppercase text-xs"> GIT</span>
          <p className="text-sm font-medium">{projectData!.GhRepo?.name}</p>
        </div>
      </div>
      <div className="w-screen bg-gray-100 border pt-10 pb-2">
        <h3 className="text-4xl mx-auto max-w-3xl font-medium">Production Deployment</h3>
        <div className="rounded-md max-w-5xl shadow p-3">
          <span className="uppercase text-gray-800 font-medium text-sm">Deployment</span>
          <Link href={production?.domain!}>{production?.domain}</Link>
        </div>
      </div>

      <h3 className="text-4xl mx-auto max-w-3xl font-medium">Preview Deployments</h3>
      {projectData!.Deployments.map((dpmt) => {
        if (production?.id !== dpmt.id) {
          return (
            <div className="p-4 rounded-md shadow-md border my-1" key={dpmt.id}>
              <div className="flex flex-nowrap gap-2">
                <Link href={dpmt.domain}>
                  <a className="text-md font-medium">{dpmt.domain}</a>
                </Link>
              </div>
            </div>
          )
        } else return <></>
      })}
    </>
  )
}
ProjectPage.getLayout = (page) => <Layout>{page}</Layout>
export default ProjectPage
