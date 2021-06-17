import { BlitzPage, GetServerSideProps, getSession } from 'blitz'
import Layout from 'app/core/layouts/Layout'
import React from 'react'

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Home: BlitzPage = () => {
  return (
    <>
      <section className="text-gray-700 body-font">
        <div className="max-w-5xl container mx-auto flex px-5 py-10 md:flex-row flex-col items-center">
          <div className="md:max-w-xl lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src="https://dummyimage.com/720x600"
            />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-22 md:pl-14 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className=" text-4xl mb-4 font-semibold text-gray-900">
              Deploy your apps with ease
            </h1>
            <p className="mb-8 leading-relaxed">
              Worffl allows you to deploy your apps from Github with ease.
              <br className="inline-block" />
              <br className="inline-block" />
              Just Commit, Push, and we&apos;ll do the rest.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Button
              </button>
              <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Button
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)

  if (session.userId) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
