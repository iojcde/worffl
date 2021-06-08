import Link from 'next/link'
import React, { Suspense } from 'react'
import { Image } from 'blitz'
import { useCurrentUser } from '../hooks/useCurrentUser'

const ProfilePicture: React.FC<{ className?: string }> = ({ className }) => {
  const user = useCurrentUser()
  if (user?.picture) {
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
          src={user?.picture}
          //  This navbar only shows when logged in, so this doesnt matter
        />
      </div>
    )
  } else {
    return <Link href="/api/auth/github">Sign in</Link>
  }
}

const Header: React.FC = () => {
  return (
    <>
      <nav className="px-4 border-b py-4  bg-white text-black ">
        <div className="max-w-5xl mx-auto md:px-2">
          <div className="flex justify-between h-18 items-center">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center flex-shrink-0">
                  <svg
                    className="w-8 h-8 mr-2 "
                    width="54"
                    fill="url(#grad1)"
                    stroke="url(#grad1)"
                    height="54"
                    viewBox="0 0 54 54"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#818CF8', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
                  </svg>
                  <span className="text-2xl font-semibold tracking-tight text-black">Worffl</span>
                </a>
              </Link>
              <div className="hidden md:flex items-center gap-8 text-sm text-black ml-4 md:ml-16">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/settings">Settings</Link>
              </div>
            </div>

            <div className="items-center   text-sm flex gap-4">
              <Suspense fallback={<div className="rounded-full w-8 h-8 border mr-2"></div>}>
                <ProfilePicture />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
