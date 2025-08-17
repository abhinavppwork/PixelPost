import { NavLink, Outlet } from 'react-router-dom'

function AuthorProfile() {
  return (
    <div className="container mt-4">
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthorProfile
