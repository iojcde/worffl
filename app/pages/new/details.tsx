import { BlitzPage, useMutation, GetServerSideProps, Image } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import React, { Suspense } from 'react'
import { AiFillGithub } from 'react-icons/ai'
import { FiGitBranch } from 'react-icons/fi'
import createProject from 'app/projects/mutations/createProject'
import { Form, Field } from 'react-final-form'

import db, { GhRepo } from 'db'
import { useCurrentUser } from 'app/core/hooks/useCurrentUser'

const EditNewProjectPage: BlitzPage<{
  data: GhRepo
  shortName: string
  target: string
}> = ({ data, shortName }) => {
  const [createProjectMutation] = useMutation(createProject)
  const onSubmit = async (values): Promise<void> => {
    await createProjectMutation({
      lang: data.lang === null ? '' : data.lang,
      ownerType: 'USER',
      name: values.name,
      ghRepoId: data.id,
      domains: 'helo.worffl.jcde.xyz',
      mainBranch: data.defaultBranch,
      commands: {
        installCmd: values.installCmd,
        buildCmd: values.buildCmd,
        startCmd: values.startCmd,
      },
    })
    alert('helo')
  }
  return (
    <Form
      onSubmit={onSubmit}
      validate={(values) => {
        interface errorsType {
          name?: string
          installCmd?: string
          buildCmd?: string
          startCmd?: string
        }
        const errors: errorsType = {}
        if (!values.name) {
          errors.name = 'Required'
        }
        if (!values.installCmd) {
          errors.installCmd = 'Required'
        }
        if (!values.buildCmd) {
          errors.buildCmd = 'Required'
        }
        if (!values.startCmd) {
          errors.startCmd = 'Required'
        }
        return errors
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="border   filter drop-shadow-xl bg-white   p-4 md:p-8 max-w-2xl mx-auto transition rounded-md flex flex-col gap-4 font-medium ">
            <p className="text-3xl font-medium">Import Project</p>
            <span className="md:flex gap-1 hidden text-sm font-normal justify-start items-center flex-nowrap">
              <span className="font-medium flex">
                Importing <AiFillGithub className=" mr-1 ml-2" size={18} />
                {data.name}
              </span>
              <FiGitBranch />
              <span className=" font-medium">{data.defaultBranch}</span>
              into
              <Suspense fallback={<></>}>
                <UserProfile />
              </Suspense>
            </span>
            <span className="md:hidden flex text-sm font-normal justify-start items-center flex-nowrap">
              Importing <AiFillGithub className=" mr-1 ml-2" size={18} />
              <span className="font-medium">{shortName}</span>
            </span>
            <hr />
            <p className="text-xl font-medium">General</p>
            <div className="flex sm:flex-nowrap flex-wrap gap-1 text-xs justify-between items-center  uppercase ">
              <span className="w-full text-gray-600">Project Name</span>
              <Field name="name" defaultValue={shortName}>
                {({ input, meta }) => (
                  <>
                    {meta.error && meta.touched && (
                      <span className="text-red-500 mr-2">{meta.error}</span>
                    )}
                    <input
                      className="border rounded-md w-full text-gray-800 placeholder-gray-400  px-3 py-2  focus:ring-1 transition duration-200 focus:text-gray-800 ring-gray-700 text-sm  outline-none"
                      {...input}
                      type="text"
                    />
                  </>
                )}
              </Field>
            </div>
            <p className="text-xl pt-4 font-medium">Deploy Configuration</p>
            <div className="flex sm:flex-nowrap flex-wrap gap-1 text-xs justify-between items-center  uppercase ">
              <span className="w-full text-gray-600">Install Command</span>
              <Field name="installCmd">
                {({ input, meta }) => (
                  <>
                    {meta.error && meta.touched && (
                      <span className="text-red-500 mr-2">{meta.error}</span>
                    )}
                    <input
                      className="border rounded-md w-full text-gray-800 placeholder-gray-400  px-3 py-2  focus:ring-1 transition duration-200 focus:text-gray-800 ring-gray-700 text-sm  outline-none"
                      placeholder="`yarn install` or `npm install`"
                      {...input}
                      type="text"
                    />
                  </>
                )}
              </Field>
            </div>
            <div className="flex sm:flex-nowrap flex-wrap gap-1 text-xs justify-between items-center  uppercase ">
              <span className="w-full text-gray-600">Build command</span>
              <Field name="buildCmd">
                {({ input, meta }) => (
                  <>
                    {meta.error && meta.touched && (
                      <span className="text-red-500 mr-2">{meta.error}</span>
                    )}
                    <input
                      className="border rounded-md w-full text-gray-800 placeholder-gray-400 px-3 py-2  focus:ring-1 transition duration-200 focus:text-gray-800 ring-gray-700 text-sm  outline-none"
                      placeholder="`yarn build` or `npm build`"
                      {...input}
                      type="text"
                    />
                  </>
                )}
              </Field>
            </div>
            <div className="flex sm:flex-nowrap flex-wrap gap-1 text-xs justify-between items-center  uppercase ">
              <span className="w-full text-gray-600">Start command</span>
              <Field name="startCmd">
                {({ input, meta }) => (
                  <>
                    {meta.error && meta.touched && (
                      <span className="text-red-500 mr-2">{meta.error}</span>
                    )}
                    <input
                      className="border rounded-md w-full text-gray-800 placeholder-gray-400 px-3 py-2  focus:ring-1 transition duration-200 focus:text-gray-800 ring-gray-700 text-sm  outline-none"
                      placeholder="`yarn start` or `npm start`"
                      {...input}
                      type="text"
                    />
                  </>
                )}
              </Field>
            </div>
            <button className="button max-w-min" type="submit">
              Submit
            </button>
          </div>
        </form>
      )}
    />
  )
}

const UserProfile: React.FC<{ className?: string }> = ({ className }) => {
  const user = useCurrentUser()
  if (user?.picture) {
    return (
      <div className="ml-1 flex items-center">
        <Image
          width={16}
          height={16}
          loading="lazy"
          alt=""
          priority={false}
          decoding="async"
          className={className + ' rounded-full'}
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          src={user?.picture}
          //  This navbar only shows when logged in, so this doesnt matter
        />
        <span className="ml-1">{user.name}</span>
      </div>
    )
  }
  return <></>
}
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query.id === undefined || typeof query.id !== 'string' || query.target === undefined)
    return {
      redirect: {
        destination: '/new',
        permanent: false,
      },
    }
  const data = await db.ghRepo.findFirst({ where: { id: parseInt(query.id) } })

  const re = /\/(.+)/
  if (data == null) {
    return {
      redirect: {
        destination: '/new',
        permanent: false,
      },
    }
  }

  const parsed = re.exec(data.name)
  if (parsed == null) {
    return {
      redirect: {
        destination: '/new',
        permanent: false,
      },
    }
  }

  return {
    props: {
      data,
      shortName: parsed[1],
      target: query.target,
    },
  }
}
EditNewProjectPage.authenticate = { redirectTo: '/login' }
EditNewProjectPage.getLayout = (page) => <Layout title={'Create New Project'}>{page}</Layout>

export default EditNewProjectPage
