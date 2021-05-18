import { Routes } from ".blitz"
import { useTheme } from "@geist-ui/react"
import Link from "next/link"
import React from "react"

const Header: React.FC = () => {
  const theme = useTheme()

  return (
    <>
      <nav className=" border-b opacity-90 z-10 py-4 h-8 items-center">
        <div className="menu-nav mx-auto text-sm">
          <Link href="/">
            <span className="text-3xl font-semibold cursor-pointer">Dply.app</span>
          </Link>
          <Link href={Routes.NewProjectPage()}>Projects</Link>
          <div className="md:flex items-center  hidden">
            <Link href="/api/auth/github">
              <span className="text-gray-700 cursor-pointer mr-5">Login</span>
            </Link>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .menu-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          padding: 0 ${theme.layout.pageMargin};

          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default Header
