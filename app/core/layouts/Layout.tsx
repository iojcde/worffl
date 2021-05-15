import { ReactNode } from "react"
import { Head } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div className=" transition-colors duration-200 w-screen">
      <Head>
        <title>{title || "sirius"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 pt-12 max-w-3xl mx-auto container  max-w-3xl  px-2 ">{children}</main>
    </div>
  )
}

export default Layout
