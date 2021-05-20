import { ReactNode } from 'react'
import { Head } from 'blitz'
import { useTheme } from '@geist-ui/react'

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const theme = useTheme()
  return (
    <div className=" w-screen min-h-screen">
      <Head>
        <title>{title || 'Sirius'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
