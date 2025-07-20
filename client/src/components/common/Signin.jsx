import React from 'react'
import { SignIn } from '@clerk/clerk-react'

function Signin() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <SignIn routing="path" path="/signin" />
    </div>
  )
}

export default Signin
