import { FC, Suspense } from "react"
import { useRouter } from "blitz"
import { Avatar, Button, useTheme, Popover } from "@geist-ui/react"
import * as Icons from "react-feather"
import Submenu from "app/core/components/Submenu"
import UserSettings from "app/core/components/UserSettings"
import { usePrefers } from "app/core/hooks/usePrefers"
import { useCurrentUser } from "../hooks/useCurrentUser"

const ProfilePicture: FC = () => {
  const user = useCurrentUser()
  if (user !== null && user.picture !== null) return <Avatar src={user.picture} text="OA" />
  else return <Avatar text="OA" />
}

const UserName: FC = () => {
  const user = useCurrentUser()
  const router = useRouter()

  if (user !== null && user.picture !== null)
    return <span style={{ fontSize: "14px" }}>{user?.name}</span>
  else router.push("/")
  return <></>
}
const ProjectInfo: React.FC = () => {
  const theme = useTheme()
  return (
    <div className="flex items-center">
      <UserName />
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
      <span className="menu-nav__title" style={{ fontSize: "14px" }}>
        Example Project
      </span>
    </div>
  )
}

const Menu: React.FC = () => {
  const theme = useTheme()
  const prefers = usePrefers()

  return (
    <>
      <nav className="menu-nav transition">
        <Suspense fallback={<p>he</p>}>
          <ProjectInfo />
        </Suspense>
        <div>
          <Button
            aria-label="Toggle Dark mode"
            className="theme-button"
            auto
            type="abort"
            onClick={() => prefers.switchTheme(theme.type === "dark" ? "light" : "dark")}
          >
            {theme.type === "dark" ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
          </Button>
          <Popover
            content={<UserSettings />}
            placement="bottomEnd"
            portalClassName="user-settings__popover"
          >
            <button className="user-settings__button">
              <Suspense fallback={<Avatar text="OA" />}>
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
          padding: 0 ${theme.layout.pageMargin};
          background-color: ${theme.palette.background};
          font-size: 16px;
          height: 54px;
          box-sizing: border-box;
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

export default Menu
