'use client'
import StoreProvider from "./redux"
import GloabalWrapper from "./GloabalWrapper"

const ApplicationWrapper = ({children}:{children : React.ReactNode}) => {
  return (
    <div>
        <StoreProvider>
            <GloabalWrapper>
              {children}
            </GloabalWrapper>
        </StoreProvider>
    </div>
  )
}

export default ApplicationWrapper