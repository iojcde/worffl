import { ReactNode, Suspense } from 'react'
import { Head } from 'blitz'
import { useTheme } from '@geist-ui/react'
import ProjectMenu from 'app/core/components/ProjectNav'
import Menu from 'app/core/components/Nav'
import { useCurrentUser } from '../hooks/useCurrentUser'
type LayoutProps = {
  title?: string
  children: ReactNode
}
const NavSwitch: React.FC = () => {
  const user = useCurrentUser()
  if (user === null) return <Menu />
  else return <ProjectMenu />
}
const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const theme = useTheme()
  return (
    <div className=" w-screen min-h-screen">
      <Head>
        <title>{title || 'Sirius'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Suspense fallback={<ProjectMenu />}>
        <NavSwitch />
      </Suspense>
      <main className=" transition  main pt-12 mx-auto  ">{children}</main>
      <style jsx>{`
        .main {
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          padding: 0 ${theme.layout.pageMargin};

          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Layout
