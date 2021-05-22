import React, { useState, useEffect } from 'react'
import { useRouter } from 'blitz'
import { Tabs, useTheme } from '@geist-ui/react'

const Submenu: React.FC = () => {
  const theme = useTheme()
  const router = useRouter()
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const scrollHandler = (): void => setSticky(document.documentElement.scrollTop > 54)
    document.addEventListener('scroll', scrollHandler)
    return () => document.removeEventListener('scroll', scrollHandler)
  }, [setSticky])

  return (
    <>
      <nav className="sub-menu__wrapper transition shadow-sm ">
        <div className={`sub-menu ${sticky ? 'sub-menu_sticky' : ''}`}>
          <div className="sub-menu__inner">
            <Tabs value={router.asPath} onChange={(route) => router.push(route)}>
              <Tabs.Item label="Overview" value="/" />
              <Tabs.Item label="Projects" value="/projects" />
              <Tabs.Item label="Integrations" value="/integrations" />
              <Tabs.Item label="Activity" value="/activity" />
              <Tabs.Item label="Domains" value="/domains" />
              <Tabs.Item label="Usage" value="/usage" />
              <Tabs.Item label="Settings" value="/settings" />
            </Tabs>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .sub-menu__wrapper {
          height: 48px;
          position: relative;
          background-color: ${theme.palette.background};
          overflow: hidden;
        }
        .sub-menu_sticky {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;

          box-shadow: rgba(0, 0, 0, 0.1) 0 0 15px 0;
        }
        .sub-menu__inner {
          display: flex;
          width: ${theme.layout.pageWidthWithMargin};

          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          height: 48px;
          box-sizing: border-box;
          overflow-y: hidden;
          overflow-x: auto;
          overflow: -moz-scrollbars-none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          box-sizing: border-box;
        }
        .sub-menu__inner::-webkit-scrollbar {
          display: none;
        }
        .sub-menu__inner :global(.content) {
          display: none;
        }
        .sub-menu__inner :global(.tabs),
        .sub-menu__inner :global(header) {
          height: 100%;
          border: none;
        }
        .sub-menu__inner :global(.tab) {
          height: calc(100% - 2px);
          padding-top: 0;
          padding-bottom: 0;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
        }
        .sub-menu__inner :global(.tab):hover {
          color: ${theme.palette.foreground};
        }
        .sub-menu__inner :global(.active) {
          color: ${theme.palette.foreground};
        }
      `}</style>
    </>
  )
}

export default Submenu
