import { NavLink, Outlet } from 'react-router-dom'

function AuthorProfile() {
  return (
    <div className="container mt-4">
      <ul className='nav nav-pills justify-content-around fs-4'>
        <li className='nav-item'>
          <NavLink to="articles" className="nav-link">Articles</NavLink>
        </li>
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthorProfile
