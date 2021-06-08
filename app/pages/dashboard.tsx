import { BlitzPage, Link, Image, useQuery } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import React, { Suspense } from 'react'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'
import getProjects from 'app/projects/queries/getProjects'
import { Project, Team, User } from 'db'

/* const UserSection: React.FC = () => {
  const user = useCurrentUser()

  return (
    <>
      <button
        onClick={() =>
          window.open(
            '/api/auth/github',
            'Sign up with GitHub',
            'toolbar=no,location=no,menubar=no',
          )
        }
      >
        Login with GitHub
      </button>
    </>
  )
} */

const ProfilePicture: React.FC<{ className?: string }> = ({ className }) => {
  const user = useCurrentUser()
  if (user?.picture) {
    return (
      <div className="mr-2 flex items-center">
        <Image
          width={100}
          height={100}
          loading="lazy"
          alt=""
          priority={false}
          decoding="async"
          className={className + ' rounded-full '}
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          src={user?.picture}
          //  This navbar only shows when logged in, so this doesnt matter
        />
      </div>
    )
  } else {
    return <Link href="/api/auth/github">Sign in</Link>
  }
}

const DashboardContent: BlitzPage = () => {
  const user = useCurrentUser()
  return (
    <>
      <div className="flex items-center gap-2 ">
        <div className="justify-between flex items-center flex-wrap w-full gap-4">
          <Suspense fallback={<></>}>
            <div className="flex items-center gap-2">
              <ProfilePicture />
              <span className="text-4xl font-semibold">{user?.name}</span>
            </div>
          </Suspense>

          <Link href="/new">
            <button className="button">New Project</button>
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-row  mt-4 ">
        <Suspense fallback={<></>}>
          <ProjectList />
        </Suspense>
      </div>
    </>
  )
}
const ProjectList: React.FC = () => {
  const user = useCurrentUser()
  const [projectData] = useQuery(getProjects, {
    where: { userId: user?.id },
    include: { user: true, team: true },
  })

  return (
    <div className="flex flex-row  w-full pt-4">
      {projectData.count >= 0 &&
        Object.keys(projectData.projects).map((key) => {
          return <ProjectCard prj={projectData.projects[key]} key={key} />
        })}
    </div>
  )
}
const ProjectCard: React.FC<{
  prj: Project & { user: User; team: Team }
}> = ({ prj }) => {
  /*   const [production] = useQuery(getProduction, { projectId: prj.id })
   */
  return (
    <div className="p-4 border rounded-md shadow-lg max-w-xl w-full">
      <div className="flex justify-between">
        <Link href={`/${prj.ownerType === 'USER' ? prj.user?.name : prj.team.name}/${prj.name}`}>
          <a className="text-2xl font-semibold">{prj.name}</a>
        </Link>
        <button className="button nocolor small">Visit</button>
      </div>
      {/*  <span>{production?.domain}</span> */}
    </div>
  )
}

const Dashboard: BlitzPage = () => {
  return (
    <Suspense fallback={<></>}>
      <DashboardContent />
    </Suspense>
  )
}

Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
