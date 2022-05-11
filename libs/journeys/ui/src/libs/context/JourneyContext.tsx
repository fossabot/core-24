import { createContext, ReactElement, ReactNode, useContext } from 'react'
import { JourneyFields as Journey } from './__generated__/JourneyFields'

interface Context {
  journey?: Journey
  admin?: boolean
}

const JourneyContext = createContext<Context>({})

export function useJourney(): Context {
  const context = useContext(JourneyContext)

  return context
}

interface JourneyProviderProps {
  children: ReactNode
  value: Context
}

export function JourneyProvider({
  value,
  children
}: JourneyProviderProps): ReactElement {
  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  )
}
