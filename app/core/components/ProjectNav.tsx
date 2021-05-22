/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, Suspense } from 'react'
import { Avatar, Button, useTheme, Popover } from '@geist-ui/react'
import * as Icons from 'react-feather'
import Submenu from 'app/core/components/Submenu'
import UserSettings from 'app/core/components/UserSettings'
import { usePrefers } from 'app/core/hooks/usePrefers'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Image } from 'blitz'
const ProfilePicture: FC<{ className?: string }> = ({ className }) => {
  const user = useCurrentUser()
  return (
    <div className="mr-2 flex items-center">
      <Image
        width={32}
        height={32}
        loading="lazy"
        alt=""
        priority={false}
        decoding="async"
        className={className + ' rounded-full '}
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        src={user?.picture!}
        //  This navbar only shows when logged in, so this doesnt matter
      />
    </div>
  )
}

const UserName: FC = () => {
  const user = useCurrentUser()
  if (user !== null && user.name !== null)
    return (
      <span className="menu-nav__title" style={{ fontSize: '14px', fontWeight: 500 }}>
        {user?.name}
      </span>
    )
  return <></>
}

const ProjectMenu: React.FC = () => {
  const theme = useTheme()
  const prefers = usePrefers()

  return (
    <>
      <nav className="menu-nav pt-4 transition relative">
        <div className="flex items-center fade-in">
          <Suspense
            fallback={
              <>
                <Avatar />
              </>
            }
          >
            <ProfilePicture />
            <UserName />
          </Suspense>

          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
            style={{ color: theme.palette.accents_2 }}
          >
            <path d="M16.88 3.549L7.12 20.451"></path>
          </svg>
          <span className="menu-nav__projectname">Example Project</span>
        </div>
        <div>
          <Button
            aria-label="Toggle Dark mode"
            className="theme-button"
            auto
            type="abort"
            onClick={() => prefers.switchTheme(theme.type === 'dark' ? 'light' : 'dark')}
          >
            {theme.type === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
          </Button>
          <Popover
            className="mr-3"
            content={<UserSettings />}
            placement="bottomEnd"
            portalClassName="user-settings__popover"
          >
            <button className="user-settings__button flex items-center">
              <Suspense fallback={<Avatar text="" />}>
                <ProfilePicture />
              </Suspense>
            </button>
          </Popover>
        </div>
      </nav>
      <Submenu />
      <style jsx>{`
        .menu-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          background-color: ${theme.palette.background};
          font-size: 16px;
          height: 48px;
          box-sizing: border-box;
        }

        .menu-nav__title {
          font - size: 14px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0;
        }
        .menu-nav__projectname {
          font - size: 13px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0;
        }
        .menu-nav > div {
          display: flex;
          align-items: center;
        }
        .menu-nav :global(.theme-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          padding: 0;
          margin: 0 ${theme.layout.gapHalf};
        }
        .user-settings__button {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          appearance: none;
          cursor: pointer;
        }
        :global(.user-settings__popover) {
          width: 180px !important;
        }
      `}</style>
    </>
  )
}

export default ProjectMenu
