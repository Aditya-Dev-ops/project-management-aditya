'use client'
import StoreProvider from "./redux"

const ApplicationWrapper = ({children}:{children : React.ReactNode}) => {
  return (
    <div>
        <StoreProvider>
            {children}
        </StoreProvider>
    </div>
  )
}

export default ApplicationWrapper