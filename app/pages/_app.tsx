import {
  AppProps,
  ErrorComponent,
  useRouter,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import React, { useCallback, useEffect, useState } from "react"
import { GeistProvider, CssBaseline } from "@geist-ui/react"

import { PrefersContext, themes, ThemeType } from "app/core/hooks/usePrefers"
import { ErrorBoundary } from "react-error-boundary"
import Menu from "app/core/components/ProjectNav"
import "app/core/styles/index.css"
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  const [themeType, setThemeType] = useState<ThemeType>("light")

  useEffect(() => {
    document.documentElement.removeAttribute("style")
    document.body.removeAttribute("style")

    const theme = window.localStorage.getItem("theme") as ThemeType
    if (themes.includes(theme)) setThemeType(theme)
  }, [])

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme)
    if (typeof window !== "undefined" && window.localStorage)
      window.localStorage.setItem("theme", theme)
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <PrefersContext.Provider value={{ themeType, switchTheme }}>
          <Menu />
          {getLayout(<Component {...pageProps} />)}
        </PrefersContext.Provider>
      </GeistProvider>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps): JSX.Element {
  const router = useRouter()
  if (error instanceof AuthenticationError) {
    return <>{router.push("/api/auth/github")}</>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
