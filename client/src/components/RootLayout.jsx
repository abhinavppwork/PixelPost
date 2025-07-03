import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./common/Header"
import Footer from "./common/Footer"
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}





const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <div>
        <Header />
            <div style={{minHeight : "90vh"}}>
                <Outlet />
            </div>
        <Footer />
        </div>
      </ClerkProvider>
      
  )
}

export default RootLayout
