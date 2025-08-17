import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthorProfile() {
  return (
    <div className="container mt-4">
      <Outlet />
    </div>
  )
}

export default AuthorProfile
