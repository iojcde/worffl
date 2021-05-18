import { createContext, useContext } from "react"

export const themes = ["light", "dark"] as const
export type ThemeType = typeof themes[number]

interface Prefers {
  themeType: ThemeType
  switchTheme: (type: ThemeType) => void
}

export const PrefersContext = createContext<Prefers>({
  themeType: "dark",
  // These are only the default ones
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  switchTheme: () => {},
})

export const usePrefers = (): Prefers => useContext(PrefersContext)
