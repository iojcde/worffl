import { ReactNode } from 'react'
import { Head } from 'blitz'
import Menu from 'app/core/components/Nav'
type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div className=" w-screen min-h-screen">
      <Head>
        <title>{title || 'Sirius'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Menu />
      <main className=" transition  main pt-12 w-full">{children}</main>
    </div>
  )
}

export default Layout
